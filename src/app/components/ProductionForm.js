"use client";
import React, { useState } from "react";

const ProductionForm = ({ onSubmit }) => {
  const [bolas, setBolas] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bolas > 0) {
      onSubmit(Number(bolas));
      setBolas(0);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <span className="input-group-text">Nº de bolas a producir</span>
        <input
          type="number"
          className="form-control"
          min="1"
          value={bolas}
          onChange={(e) => setBolas(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">
          Calcular Torres
        </button>
      </div>
    </form>
  );
};

export default ProductionForm;
