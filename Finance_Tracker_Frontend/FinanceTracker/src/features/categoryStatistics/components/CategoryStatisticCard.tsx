import React, { useState } from "react";
import "../../../css/CategoryStatisticComponent.css";
import { StatisticCategoryDto } from "../../../api/dto/StatisticDto";

type Props = {
  statisticsForAllCategories: StatisticCategoryDto[];
};

const CategoryStatisticCard: React.FC<Props> = ({ statisticsForAllCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<StatisticCategoryDto | null>(null);

  const handleCategoryClick = (category: StatisticCategoryDto) => {
    setSelectedCategory(category);
  };

  return (
    <div className="category-stat-layout">
      <div className="category-list">
        {statisticsForAllCategories.map((category) => (
          <div
            key={category.name}
            className={`category-item ${selectedCategory?.name === category.name ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </div>
        ))}
      </div>

      <div className="category-detail">
        {selectedCategory ? (
          <>
            <h2>{selectedCategory.name}</h2>
            <div className="detail-row">
              <span>💵 Income:</span>
              <span className="income">+{selectedCategory.plusSum.toLocaleString()} $</span>
            </div>
            <div className="detail-row">
              <span>📉 Spending:</span>
              <span className="spending">{selectedCategory.minusSum.toLocaleString()} $</span>
            </div>
            <div className="detail-row">
              <span>💳 Transactions:</span>
              <span>{selectedCategory.countTransaction}</span>
            </div>
            <div className="detail-row">
              <span>📊 Avg:</span>
              <span>
                +{(selectedCategory.plusSum / selectedCategory.countTransaction || 0).toFixed(2)} / -
                {(selectedCategory.minusSum / selectedCategory.countTransaction || 0).toFixed(2)} $
              </span>
            </div>

          </>
        ) : (
          <div className="placeholder">Оберіть категорію для перегляду деталей</div>
        )}
      </div>
    </div>
  );
};

export default CategoryStatisticCard;
