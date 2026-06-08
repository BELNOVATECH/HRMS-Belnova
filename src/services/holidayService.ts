import axios from "axios";

const API_BASE_URL = "https://hrms-be-ppze.onrender.com";

export interface HolidayApi {
  id: number;
  holiday_name: string;
  holiday_date: string;
}

export const fetchHolidays = async (): Promise<HolidayApi[]> => {
  const response = await axios.get(`${API_BASE_URL}/holidays/`, {
    // 🔥 force fresh request (prevents 304)
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    // 🔥 extra safety
    params: {
      t: new Date().getTime(),
    },
  });

  return response.data;
};
