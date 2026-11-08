import React from "react";
import { catInterface } from "../../types/components/actegorysection/catInterface";

export default function CategoryBox({ title, onClick }: catInterface) {
  return (
    <div className="category-box" onClick={onClick}>
      {title}
    </div>
  );
}
