import React, { useState, useEffect, useCallback } from "react";
import "../../css/StatisticComponent.css";
import StatisticSelectDate from "./components/StatisticSelectDate";
import StatisticCard from "./components/StatisticCard";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";
import { StatisticDto } from "../../api/dto/StatisticDto";
import UserService from "../../api/services/UserService";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import StatisticService from "../../api/services/StatisticService";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

const StatisticPage: React.FC = () => {
  const [plusTransactions, setPlusTransactions] = useState<TransactionDto[]>([]);
  const [minusTransactions, setMinusTransactions] = useState<TransactionDto[]>([]);

  const [plusPage, setPlusPage] = useState(1);
  const [minusPage, setMinusPage] = useState(1);

  const [plusTotalPages, setPlusTotalPages] = useState(1);
  const [minusTotalPages, setMinusTotalPages] = useState(1);

  const itemsPerPage = 11;

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [statisticsByTimeAndCategory, setStatisticsByTimeAndCategory] = useState<StatisticDto>({
    minusSum: 0,
    minusCountTransaction: 0,
    minusCountCategory: 0,
    plusSum: 0,
    plusCountTransaction: 0,
    plusCountCategory: 0,
  });

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBalance = useCallback(async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  const fetchStatisticsByTimeAndCategory = useCallback(async () => {
    try {
      const data = selectedCategory
        ? await StatisticService.getByTimeAndCategory(startDate, endDate, selectedCategory)
        : await StatisticService.getByTimeAndCategoryForAll(startDate, endDate);
      setStatisticsByTimeAndCategory(data);
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    }
  }, [startDate, endDate, selectedCategory]);

  const fetchPlusTransactions = useCallback(async () => {
    try {
      const data = selectedCategory
        ? await TransactionService.getAllPlusByUserAndDateAndCategory(
            plusPage, itemsPerPage, startDate, endDate, selectedCategory
          )
        : await TransactionService.getAllPlusByUserAndDate(
            plusPage, itemsPerPage, startDate, endDate
          );
      setPlusTransactions(data);
      setPlusTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch plus transactions", error);
    }
  }, [plusPage, itemsPerPage, startDate, endDate, selectedCategory]);

  const fetchMinusTransactions = useCallback(async () => {
    try {
      const data = selectedCategory
        ? await TransactionService.getAllMinusByUserAndDateAndCategory(
            minusPage, itemsPerPage, startDate, endDate, selectedCategory
          )
        : await TransactionService.getAllMinusByUserAndDate(
            minusPage, itemsPerPage, startDate, endDate
          );
      setMinusTransactions(data);
      setMinusTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch minus transactions", error);
    }
  }, [minusPage, itemsPerPage, startDate, endDate, selectedCategory]);

  useEffect(() => {
    setPlusPage(1);
    setMinusPage(1);
  }, [selectedCategory, startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPlusTransactions(),
      fetchMinusTransactions(),
      fetchStatisticsByTimeAndCategory(),
    ]).finally(() => setLoading(false));
  }, [plusPage, minusPage, startDate, endDate, selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchBalance();
  }, []);

  return (
    <div>
      <StatisticSelectDate
        startDate={startDate}
        endDate={endDate}
        categories={categories}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchTransactions={() => {
          fetchPlusTransactions();
          fetchMinusTransactions();
        }}
        onCategorySelect={setSelectedCategory}
      />

      {loading && <LoadingIndicator />}

      <div className="stat-cards-row">
        <StatisticCard
          type="plus"
          title="Income"
          transactions={plusTransactions}
          categories={categories}
          statisticsForAllCategories={statisticsByTimeAndCategory}
          currentPage={plusPage}
          totalPages={plusTotalPages}
          itemsPerPage={itemsPerPage}
          handlePageChange={setPlusPage}
          setTransactions={setPlusTransactions}
          fetchBalance={fetchBalance}
        />

        <StatisticCard
          type="minus"
          title="Spending"
          transactions={minusTransactions}
          categories={categories}
          statisticsForAllCategories={statisticsByTimeAndCategory}
          currentPage={minusPage}
          totalPages={minusTotalPages}
          itemsPerPage={itemsPerPage}
          handlePageChange={setMinusPage}
          setTransactions={setMinusTransactions}
          fetchBalance={fetchBalance}
        />
      </div>
    </div>
  );
};

export default StatisticPage;
