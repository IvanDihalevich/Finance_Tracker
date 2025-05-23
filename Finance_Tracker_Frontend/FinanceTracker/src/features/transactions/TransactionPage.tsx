import React, { useState, useEffect, useMemo, useCallback } from "react";
import CreateTransactionForm from "./components/CreateTransactionForm";
import TransactionTable from "./components/TransactionTable";
import BalanceDisplay from "./components/BalanceDisplay";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import UserService from "../../api/services/UserService";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";
import "../../css/Transaction.css";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const transactionsData = await TransactionService.getAllByUser(
        currentPage,
        itemsPerPage
      );
      setTransactions(
        transactionsData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setTotalPages(Math.ceil(transactionsData.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const memoizedTransactions = useMemo(() => transactions, [transactions]);
  const memoizedCategories = useMemo(() => categories, [categories]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="tp-root">
      <div className="tp-main-container">
        <div className="tp-form-section">
          <CreateTransactionForm
            categories={memoizedCategories}
            balance={balance}
            fetchTransactions={fetchTransactions}
            fetchBalance={fetchBalance}
          />
        </div>

        {loading && <LoadingIndicator />}

        <div className="tp-data-section">
          <div className="tp-table-wrapper">
            <TransactionTable
              transactions={memoizedTransactions}
              categories={memoizedCategories}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
              setTransactions={setTransactions}
              fetchBalance={fetchBalance}
            />
          </div>
          <BalanceDisplay balance={balance} />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
