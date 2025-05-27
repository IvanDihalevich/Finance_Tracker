import React from "react";
import "../../../css/StatisticComponent.css";
import TransactionTable from "../../transactions/components/TransactionTable";
import { TransactionDto } from "../../../api/dto/TransactionDto";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import { StatisticDto } from "../../../api/dto/StatisticDto";

type Props = {
  type: "plus" | "minus";
  title: string;
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
  type,
  title,
  transactions,
  categories,
  statisticsForAllCategories,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  setTransactions,
  fetchBalance,
}) => {
  const isPlus = type === "plus";

  const sum = isPlus
    ? statisticsForAllCategories.plusSum
    : statisticsForAllCategories.minusSum;

  const countTransactions = isPlus
    ? statisticsForAllCategories.plusCountTransaction
    : statisticsForAllCategories.minusCountTransaction;

  const countCategories = isPlus
    ? statisticsForAllCategories.plusCountCategory
    : statisticsForAllCategories.minusCountCategory;

  const wrapperClass = isPlus ? "stat-card-plus" : "stat-card-minus";
  const labelClass = isPlus ? "stat-sum-plus-label" : "stat-sum-minus-label";
  const valueClass = isPlus ? "stat-sum-plus-value" : "stat-sum-minus-value";
  const subClass = isPlus ? "stat-sum-plus-sub" : "stat-sum-minus-sub";
  const tableClass = isPlus ? "stat-table-plus" : "stat-table-minus";

  return (
    <div className={`stat-card-container ${wrapperClass}`}>

        <div className="stat-summary-card">
          <div>
            <h1 className={labelClass}>{title}:</h1>
            <h1 className={valueClass}>
              {sum !== undefined ? `${sum.toLocaleString()}$` : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className={subClass}>
              Транзакцій: {countTransactions !== undefined ? countTransactions : "N/A"}
            </h1>
          </div>
          <div>
            <h1 className={subClass}>
              Категорій: {countCategories !== undefined ? countCategories : "N/A"}
            </h1>
          </div>
        </div>
        <div className={tableClass}>
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
  );
};

export default StatisticCard;
