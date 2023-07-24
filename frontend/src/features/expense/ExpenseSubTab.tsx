
export interface subTabProps {
    isShown: boolean;
    result: { name: string,
        category: string,
        budget: number,
        expense: number,
    }[],
    onHide: ()=> void
}

export interface subTabDetail{
        name: string,
        category: string,
        budget: number,
        expense: number
}
export function BudgetSubTab(props:subTabProps){
    const detail = props.result
    console.log(`budget:${detail}`)
    return ( <div>{detail && detail.map((tab:subTabDetail) => (
        <div className="subTab">
          <div>{tab.category} </div>
          <div>${tab.budget}</div>
        </div>
      ))}</div>
    )
   
}
export function ExpenseSubTab(props:subTabProps){
    const detail = props.result
    console.log(`expense:${detail}`)
    return ( <div>{detail &&
    
        detail.map((tab:subTabDetail) => (
        <div className="subTab">
          <div>{tab.category} </div>
          <div>${tab.expense}</div>
        </div>
      ))}</div>
    )
   
}
