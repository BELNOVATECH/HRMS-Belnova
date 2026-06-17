import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Badge, Table, Spin, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import {
  getLeaveHistoryApi,
  LeaveHistoryItem,
} from "../../services/leaveCalendarService";
import { fetchHolidays, HolidayApi } from "../../services/holidayService";
import "./LeaveCalendar.css";

const LeaveCalendar: React.FC = () => {
// const empId = Number(localStorage.getItem("hrms-employee-id"));
const empId=203;
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<LeaveHistoryItem[]>([]);
  const [holidays, setHolidays] = useState<HolidayApi[]>([]);
  const [selectedDate, setSelectedDate] =
    useState<dayjs.Dayjs | null>(null);

  /* ================= LOAD DATA ================= */
  const loadLeavesAndHolidays = async () => {
    try {
      setLoading(true);

      const [historyRes, holidayData] = await Promise.all([
        getLeaveHistoryApi(empId),
        fetchHolidays(),
      ]);

      setHolidays(holidayData || []);

      const approvedLeaves =
        (historyRes.data || []).filter(
          (l: LeaveHistoryItem) =>
            l.status_name === "Approved"
        );

      setLeaves(approvedLeaves);
    } catch (err) {
      console.error(err);
      message.error("Failed to load leave calendar or holidays");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (!empId) {
    message.error("Employee not found. Please login again.");
    return;
  }

  loadLeavesAndHolidays();

  const refresh = () => loadLeavesAndHolidays();
  window.addEventListener("leave-updated", refresh);

  return () =>
    window.removeEventListener("leave-updated", refresh);
}, [empId]);


  /* ================= GROUP LEAVES BY DATE (NO DUPLICATES) ================= */
  const leavesByDate = useMemo(() => {
    const map = new Map<string, LeaveHistoryItem[]>();

    leaves.forEach((l) => {
      let current = dayjs(l.start_date);
      const end = dayjs(l.end_date);

      while (current.diff(end, "day") <= 0) {
        const key = current.format("YYYY-MM-DD");
        const arr = map.get(key) || [];

        if (
          !arr.some(
            (e) =>
              e.leave_request_id === l.leave_request_id
          )
        ) {
          arr.push(l);
        }

        map.set(key, arr);
        current = current.add(1, "day");
      }
    });

    return map;
  }, [leaves]);

  /* ================= MAP HOLIDAYS ================= */
  const holidaysByDate = useMemo(() => {
    const map = new Map<string, HolidayApi[]>();

    holidays.forEach((h) => {
      const key = dayjs(h.holiday_date).format("YYYY-MM-DD");
      const arr = map.get(key) || [];
      arr.push(h);
      map.set(key, arr);
    });

    return map;
  }, [holidays]);

  /* ================= BADGE COLOR ================= */
  const getBadgeStatus = (item: LeaveHistoryItem) => {
    if (item.leave_type === "Restricted Holiday") return "warning";
    if (item.leave_type === "General Holiday") return "processing";
    return "processing";
  };

  /* ================= CALENDAR CELL ================= */
  const dateCellRender = (value: dayjs.Dayjs) => {
    const leaveItems =
      leavesByDate.get(value.format("YYYY-MM-DD")) || [];
    const holidayItems =
      holidaysByDate.get(value.format("YYYY-MM-DD")) || [];

    if (!leaveItems.length && !holidayItems.length)
      return null;

    return (
      <div className="calendar-badges">
        {leaveItems.map((item) => (
          <Badge
            key={
              item.leave_request_id !== undefined
                ? String(item.leave_request_id)
                : `${item.start_date}-${item.end_date}`
            }
            status={getBadgeStatus(item)}
            className="leave-badge"
          />
        ))}

        {holidayItems.map((h, idx) => (
          <div key={`holiday-${idx}`} className="holiday-item">
            <Badge color="#722ed1" className="holiday-dot" />
            <span className="holiday-text">
              {h.holiday_name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  /* ================= TABLE DATA (DEDUPLICATED & TYPE SAFE) ================= */
  const tableData = useMemo(() => {
    if (!selectedDate) return [];

    const items =
      leavesByDate.get(
        selectedDate.format("YYYY-MM-DD")
      ) || [];

    const unique = new Map<string, LeaveHistoryItem>();

    items.forEach((i) => {
      const key =
        i.leave_request_id !== undefined
          ? String(i.leave_request_id)
          : `${i.start_date}-${i.end_date}`;

      unique.set(key, i);
    });

    return Array.from(unique.values());
  }, [selectedDate, leavesByDate]);

  /* ================= TABLE ================= */
  const columns: ColumnsType<LeaveHistoryItem> = [
    { title: "Leave Type", dataIndex: "leave_type", align: "center" },
    { title: "From", dataIndex: "start_date", align: "center" },
    { title: "To", dataIndex: "end_date", align: "center" },
    { title: "Days", dataIndex: "total_days", align: "center" },
    { title: "Status", dataIndex: "status_name", align: "center" },
  ];

  return (
    <div className="leave-calendar-page">
      <Spin spinning={loading}>
        <div className="calendar-card">
          <h3 className="calendar-title">Leave Calendar</h3>

          <Calendar
            dateCellRender={dateCellRender}
            onSelect={setSelectedDate}
          />

          <div className="calendar-legend">
            <div className="calendar-legend-item">
              <span className="calendar-legend-badge blue" />
              Approved
            </div>

            <div className="calendar-legend-item">
              <span className="calendar-legend-badge yellow" />
              Restricted Holiday
            </div>

            <div className="calendar-legend-item">
              <span className="calendar-legend-badge purple" />
              General Holiday
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3 className="details-title">
            Leave Details{" "}
            {selectedDate &&
              `(${selectedDate.format("YYYY-MM-DD")})`}
          </h3>

          <Table
            rowKey={(r) =>
              String(
                r.leave_request_id ??
                  `${r.start_date}-${r.end_date}`
              )
            }
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
            locale={{
              emptyText: selectedDate
                ? "No leaves on selected date"
                : "Select a date to view leave details",
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default LeaveCalendar;
