import React, { useEffect, useState } from "react";
import "../../../css/StatisticComponent.css";
import { CategoryDto } from "../../../api/dto/CategoryDto";

type Props = {
  startDate: string;
  endDate: string;
  categories: CategoryDto[];
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  fetchTransactions: () => void;
  onCategorySelect: (categoryId: string) => void;
};

const StatisticSelectDate: React.FC<Props> = ({
  startDate,
  endDate,
  categories,
  setStartDate,
  setEndDate,
  fetchTransactions,
  onCategorySelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date();
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    start.setFullYear(currentDate.getFullYear() - 1);
    end.setFullYear(currentDate.getFullYear() + 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [setStartDate, setEndDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate, selectedCategory]);

  return (
    <div className="stat-select-container">
      <label className="stat-select-row">
        <span>Start Date:</span>
        <span className="stat-select-input-wrapper">
          <input
            type="date"
            name="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </span>
      </label>
      <label className="stat-select-row">
        <span>End Date:</span>
        <span className="stat-select-input-wrapper">
          <input
            type="date"
            name="end-date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </span>
      </label>
      <label className="stat-select-row">
        <span>Category:</span>
        <span className="stat-select-input-wrapper">
          <select
            className="stat-select-dropdown"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </span>
      </label>
    </div>
  );
};

export default StatisticSelectDate;
