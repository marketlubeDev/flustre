import React from "react";
import PageHeader from "../../../components/Admin/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { ActiveOffersTable } from "../../../components/Admin/ActiveOffersTable";

export const ActiveOffers = () => {
  const [activeOffersData, loading, error, fetchData] = useFetch("/offer");
  const activeOffers = activeOffersData?.data || [];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <PageHeader content="Active Offers" />
      <ActiveOffersTable
        offers={activeOffers?.length ? activeOffers : undefined}
        fetchData={fetchData}
        loading={loading}
      />
    </div>
  );
};