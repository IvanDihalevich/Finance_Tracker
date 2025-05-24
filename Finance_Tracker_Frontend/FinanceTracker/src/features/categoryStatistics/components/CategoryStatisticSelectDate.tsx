import React, { useEffect } from "react";
import "../../../css/CategoryStatisticComponent.css";

type Props = {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
};

const CategoryStatisticSelectDate: React.FC<Props> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    start.setFullYear(now.getFullYear() - 1);
    end.setFullYear(now.getFullYear() + 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  return (
    <div className="category-date-panel">
      <div className="category-date-field">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          className="category-date-input"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="category-date-field">
        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          className="category-date-input"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CategoryStatisticSelectDate;
