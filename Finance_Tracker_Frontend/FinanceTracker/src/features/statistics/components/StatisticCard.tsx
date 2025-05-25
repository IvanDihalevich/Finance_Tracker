import React from "react";
import "../../../css/StatisticComponent.css";
import TransactionTable from "../../transactions/components/TransactionTable";
import { TransactionDto } from "../../../api/dto/TransactionDto";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import { StatisticDto } from "../../../api/dto/StatisticDto";

type Props = {
  transactions: TransactionDto[];
  categories: CategoryDto[];
  statisticsForAllCategories: StatisticDto;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionDto[]>>;
  fetchBalance: () => void;
};

const StatisticCard: React.FC<Props> = ({
  transactions,
  categories,
  statisticsForAllCategories,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  setTransactions,
  fetchBalance,
}) => (
  <div className="stat-card-wrapper">
    <div className="stat-card-container">
      <div className="stat-card-plus">
        <div className="stat-summary-card">
          <div>
            <h1 className="stat-sum-plus-label">Income:</h1>
            <h1 className="stat-sum-plus-value">
              {statisticsForAllCategories
                ? `${statisticsForAllCategories.plusSum.toLocaleString()}$`
                : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className="stat-sum-plus-sub">
              {statisticsForAllCategories
                ? `Транзакцій: ${statisticsForAllCategories.plusCountTransaction}`
                : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className="stat-sum-plus-sub">
              {statisticsForAllCategories
                ? `Категорій: ${statisticsForAllCategories.plusCountCategory}`
                : "N/A"}
            </h1>
          </div>
        </div>
        <div className="stat-table-plus">
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            setTransactions={setTransactions}
            fetchBalance={fetchBalance}
          />
        </div>
      </div>

      {/* Spending Card */}
      <div className="stat-card-minus">
        <div className="stat-summary-card">
          <div>
            <h1 className="stat-sum-minus-label">Spending:</h1>
            <h1 className="stat-sum-minus-value">
              {statisticsForAllCategories
                ? `${statisticsForAllCategories.minusSum.toLocaleString()}$`
                : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className="stat-sum-minus-sub">
              {statisticsForAllCategories
                ? `Транзакцій: ${statisticsForAllCategories.minusCountTransaction}`
                : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className="stat-sum-minus-sub">
              {statisticsForAllCategories
                ? `Категорій: ${statisticsForAllCategories.minusCountCategory}`
                : "N/A"}
            </h1>
          </div>
        </div>
        <div className="stat-table-minus">
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            setTransactions={setTransactions}
            fetchBalance={fetchBalance}
          />
        </div>
      </div>
    </div>
  </div>
);

export default StatisticCard;
