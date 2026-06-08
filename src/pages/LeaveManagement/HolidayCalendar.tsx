import React, { useEffect, useState } from "react";
import { Card, Select, Spin, message } from "antd";
import "./HolidayCalendar.css";
import { fetchHolidays } from "../../services/holidayService";

const { Option } = Select;

interface Holiday {
  date: string;
  name: string;
}

interface MonthlyHolidays {
  month: number;
  holidays: Holiday[];
}

const monthNames = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const getMonthlyHolidays = (holidays: Holiday[], year: number) => {
  const months: MonthlyHolidays[] = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    holidays: [],
  }));

  holidays.forEach((h) => {
    const d = new Date(h.date);
    if (d.getFullYear() === year) {
      months[d.getMonth()].holidays.push(h);
    }
  });

  return months;
};

const HolidayCalendar: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      setLoading(true);

      const apiData = await fetchHolidays();

      const formatted: Holiday[] = apiData.map((h) => ({
        date: h.holiday_date,
        name: h.holiday_name,
      }));

      setHolidays(formatted);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        message.error(
          `Error ${error.response.status}: ${error.response.statusText}`
        );
      } else {
        message.error("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  const monthlyHolidays = getMonthlyHolidays(holidays, year);

  return (
    <div className="holiday-calendar-container">
      <h2 className="holiday-calendar-title">Holiday Calendar</h2>

      <div className="holiday-calendar-year-selector">
        <Select
          value={year}
          onChange={setYear}
          className="year-select"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <Option key={y} value={y}>
              {y}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="holiday-calendar-grid">
          {monthlyHolidays.map((m) => (
            <Card
              key={m.month}
              title={`${monthNames[m.month]} ${year}`}
              className="holiday-calendar-card"
            >
              {m.holidays.length === 0 ? (
                <p className="no-holidays">No Holidays</p>
              ) : (
                m.holidays.map((h) => {
                  const d = new Date(h.date);
                  return (
                    <div key={h.date} className="holiday-item">
                      <strong className="holiday-date">
                        {String(d.getDate()).padStart(2, "0")}
                      </strong>{" "}
                      <span className="holiday-name">{h.name}</span>
                    </div>
                  );
                })
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;
