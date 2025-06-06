import React, { useState } from "react";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import "../../../css/Transaction.css";
import TransactionService from "../../../api/services/TransactionService";
import { useNotification } from "../../../components/notification/NotificationProvider";

type Props = {
  categories: CategoryDto[];
  balance: number;
  fetchTransactions: () => void;
  fetchBalance: () => void;
};

const CreateTransactionForm: React.FC<Props> = ({
  categories,
  balance,
  fetchTransactions,
  fetchBalance,
}) => {
  const { addNotification } = useNotification();
  const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<string | null>(null);
  const [newTransactionSum, setNewTransactionSum] = useState<string>("");

  const handleTransaction = async (isIncome: boolean) => {
    if (!newTransactionCategoryId) {
      addNotification("Please select a category.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum) || parsedSum <= 0) {
      addNotification(
        isIncome
          ? "You cannot enter a negative number for income."
          : "You cannot enter a negative number for expenses.",
        "error"
      );
      return;
    }

    if (!isIncome && parsedSum > balance) {
      addNotification("You don't have enough balance for this expense.", "error");
      return;
    }

    try {
      await TransactionService.create({
        sum: isIncome ? parsedSum : -parsedSum,
        categoryId: newTransactionCategoryId,
      });
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      fetchTransactions();
      fetchBalance();
      addNotification(
        isIncome
          ? "The revenue transaction was created successfully."
          : "Expense transaction created successfully.",
        "success"
      );
    } catch (error) {
      console.error("Failed to create transaction", error);
      addNotification(
        isIncome
          ? "Failed to create revenue transaction."
          : "Failed to create expense transaction.",
        "error"
      );
    }
  };

  return (
    <div className="create-transaction-container">
      <div className="create-transaction-header">
        <div className="create-transaction-sum-header">Sum</div>
        <div className="create-transaction-category-header">Category</div>
        <div className="create-transaction-action-header">Action</div>
      </div>
      <div className="create-transaction-form">
        <input
          className="create-transaction-sum-input"
          type="text"
          value={newTransactionSum}
          onChange={(e) => setNewTransactionSum(e.target.value)}
        />
        <select
          className="create-transaction-category-select"
          value={newTransactionCategoryId || ""}
          onChange={(e) => setNewTransactionCategoryId(e.target.value)}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="create-transaction-button-group">
          <button
            className="create-transaction-button"
            onClick={() => handleTransaction(true)}
          >
            Income
          </button>
          <button
            className="create-transaction-button"
            onClick={() => handleTransaction(false)}
          >
            Cost
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionForm;
