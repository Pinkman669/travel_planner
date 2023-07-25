export interface subTabProps {
  isShown: boolean;
  result: { name: string; category: string; budget: number; expense: number }[];
  onHide: () => void;
}

export interface subTabDetail {
  name: string;
  category: string;
  budget: number;
  expense: number;
}
export function BudgetSubTab(props: subTabProps) {
  const show = props.isShown;
  const detail = props.result;
  return (
    <div>
      {detail &&
        show &&
        detail.map((tab: subTabDetail) => (
          <div className="subTab">
            <div>{tab.category ? tab.category : "Other"} </div>
            <div>${tab.budget}</div>
          </div>
        ))}
    </div>
  );
}
export function ExpenseSubTab(props: subTabProps) {
  const show = props.isShown;
  const detail = props.result;
  return (
    <div>
      {detail &&
        show &&
        detail.map((tab: subTabDetail) => (
          <div className="subTab">
            <div>{tab.category ? tab.category : "Other"}</div>
            <div>${tab.expense}</div>
          </div>
        ))}
    </div>
  );
}
