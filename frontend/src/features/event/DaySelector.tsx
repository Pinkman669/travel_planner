import React from 'react'
import common from '../../css/Common.module.css'
import { IconClick } from '@tabler/icons-react'
import { useAppDispatch } from '../../redux/hooks';
import { select_day_trip } from './daySlice';

interface DaySelectorProps {
    onClickDayEffect: () => void;
    dayNumber: string;
}


export default function DaySelector(props: DaySelectorProps) {
    const dispatch = useAppDispatch()

    return (
        <div>
            <button className={common.iconBtn} onClick={() => {
                props.onClickDayEffect()
                dispatch(select_day_trip(props.dayNumber))
            }}>
                <IconClick />
            </button>
        </div>
    )
}