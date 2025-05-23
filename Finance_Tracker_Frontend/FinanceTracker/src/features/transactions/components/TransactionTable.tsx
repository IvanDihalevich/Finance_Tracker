import React, { useState, useCallback } from "react";
import { TransactionDto } from "../../../api/dto/TransactionDto";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import "../../../css/Transaction.css";

import Pagination from "../../../components/Pagination";
import TransactionService from "../../../api/services/TransactionService";
import { useNotification } from "../../../components/notification/NotificationProvider";

type Props = {
  transactions: TransactionDto[];
  categories: CategoryDto[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  fetchBalance: () => void;
  setTransactions: (transactions: TransactionDto[]) => void;
};

const TransactionTable: React.FC<Props> = ({
  transactions,
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  fetchBalance,
  setTransactions,
}) => {
  const { addNotification } = useNotification();
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [updatedTransaction, setUpdatedTransaction] = useState<TransactionDto | null>(null);

  const handleEdit = useCallback((transaction: TransactionDto) => {
    setEditingTransactionId(transaction.id);
    setUpdatedTransaction(transaction);
  }, []);

  const handleDelete = useCallback(
    async (transactionId: string) => {
      try {
        await TransactionService.delete(transactionId);
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== transactionId
        );
        setTransactions(updatedTransactions);
        fetchBalance();
        addNotification("The transaction was successfully deleted.", "success");
      } catch (error) {
        addNotification("Unable to delete transaction.", "error");
        console.error("Failed to delete transaction", error);
      }
    },
    [transactions, setTransactions, fetchBalance, addNotification]
  );

  const handleSave = useCallback(async () => {
    if (updatedTransaction && updatedTransaction.id) {
      try {
        const selectedCategory = categories.find(
          (category) => category.name === updatedTransaction.categoryName
        );
        if (!selectedCategory) throw new Error("Category not found");

        await TransactionService.update(updatedTransaction.id, {
          sum: updatedTransaction.sum,
          categoryId: selectedCategory.id!,
        });

        const updatedTransactions = transactions.map((tx) =>
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        );
        setTransactions(updatedTransactions);
        setEditingTransactionId(null);
        setUpdatedTransaction(null);
        fetchBalance();
        addNotification("The transaction was successfully saved.", "success");
      } catch (error) {
        addNotification("The transaction could not be saved.", "error");
        console.error("Failed to save transaction", error);
      }
    }
  }, [
    updatedTransaction,
    categories,
    transactions,
    setTransactions,
    fetchBalance,
    addNotification,
  ]);

  return (
    <div className="tt-container">
      <h1 className="tt-title">Your transactions</h1>
      <div className="tt-table">
        <div className="tt-table-header">
          <div className="tt-column-header tt-col-date">Create Date</div>
          <div className="tt-column-header tt-col-sum">Sum</div>
          <div className="tt-column-header tt-col-category">Category</div>
          <div className="tt-column-header tt-col-action">Action</div>
        </div>

        {transactions
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((transaction) => (
            <div key={transaction.id} className="tt-table-row">
              <div className="tt-cell tt-col-date">
                {new Date(transaction.createdAt).toLocaleString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="tt-cell tt-col-sum">
                {editingTransactionId === transaction.id ? (
                  <input
                    type="number"
                    value={updatedTransaction?.sum || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction!,
                        sum: Number(e.target.value),
                      })
                    }
                    className="tt-input"
                  />
                ) : (
                  `${transaction.sum.toLocaleString()} $`
                )}
              </div>

              <div className="tt-cell tt-col-category">
                {editingTransactionId === transaction.id ? (
                  <select
                    className="tt-select"
                    value={updatedTransaction?.categoryName || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction!,
                        categoryName: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  transaction.categoryName
                )}
              </div>
              <div className="tt-cell tt-col-action">
                {editingTransactionId === transaction.id ? (
                  <button className="tt-btn tt-save" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <button className="tt-btn tt-edit" onClick={() => handleEdit(transaction)}>
                    Edit
                  </button>
                )}
                <button
                  className="tt-btn tt-delete"
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TransactionTable;
