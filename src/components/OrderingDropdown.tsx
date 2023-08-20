import * as React from "react";
import { ListSortOrder, SORT_ORDERS } from "../model";
import Dropdown from "./Dropdown";

export const SORT_ORDER_LABELS: Record<
  ListSortOrder,
  { name: string; title: string; className: string }
> = {
  [ListSortOrder.Title]: {
    name: "By title",
    title: "Order series by name alphabetically",
    className: "ordering-by-name",
  },
  [ListSortOrder.StartDate]: {
    name: "By start date",
    title: "Order series by starting date",
    className: "ordering-by-start-date",
  },
  [ListSortOrder.Score]: {
    name: "By score",
    title: "Order series by score, highest first",
    className: "ordering-by-rating",
  },
  [ListSortOrder.UpdatedAt]: {
    name: "By update date",
    title: "Order series by the date you last updated it, latest first",
    className: "ordering-by-update-date",
  },
};

const OPTIONS = SORT_ORDERS.map((order) => ({
  key: order,
  label: SORT_ORDER_LABELS[order].name,
}));

interface OrderingDropdownProps {
  value: ListSortOrder;
  onChange: (value: ListSortOrder) => void;
  enabled: boolean;
}

const OrderingDropdown = (props: OrderingDropdownProps) => {
  return (
    <Dropdown
      className="ordering-dropdown"
      value={props.value}
      options={OPTIONS}
      onChange={props.onChange}
      enabled={props.enabled}
      invisible
      title={SORT_ORDER_LABELS[props.value].title}
    >
      <div
        className={
          "ordering-dropdown-icon " + SORT_ORDER_LABELS[props.value].className
        }
      ></div>
    </Dropdown>
  );
};

export default OrderingDropdown;
