import React, { Component } from 'react';
import { keyBy, values } from 'lodash';
import { monthByNumber, numberByMonth, daysInMonth, unit } from './helper';
import Select from 'react-select';

export class DropdownDate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startYear: null,
			startMonth: null,
			startDay: null,
			endYear: null,
			endMonth: null,
			endDay: null,
			selectedYear: -1,
			selectedMonth: -1,
			selectedDay: -1
		};
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
	}

	componentWillMount() {
		let startYear, startMonth, startDay, endYear, endMonth, endDay, selectedYear, selectedMonth, selectedDay;
		if (this.props.startDate) {
			const date = new Date(this.props.startDate);
			startYear = date.getFullYear();
			startMonth = date.getMonth();
			startDay = date.getDate();
		} else {
			startYear = 1900;
			startMonth = 0;
			startDay = 1;
		}
		if (this.props.endDate) {
			const date = new Date(this.props.endDate);
			endYear = date.getFullYear();
			endMonth = date.getMonth();
			endDay = date.getDate();
		} else {
			const date = new Date();
			endYear = date.getFullYear();
			endMonth = date.getMonth();
			endDay = date.getDate();
		}
		if (this.props.selectedDate) {
			const date = new Date(this.props.selectedDate);
			selectedYear = date.getFullYear();
			selectedMonth = date.getMonth();
			selectedDay = date.getDate();
		} else {
			selectedYear = -1;
			selectedMonth = -1;
			selectedDay = -1;
		}
		this.setState({
			startYear,
			startMonth,
			startDay,
			endYear,
			endMonth,
			endDay,
			selectedYear,
			selectedMonth,
			selectedDay
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedDate !== this.props.selectedDate) {
			const date = new Date(nextProps.selectedDate);
			let selectedYear = date.getFullYear();
			let selectedMonth = date.getMonth();
			let selectedDay = date.getDate();
			this.setState({ selectedYear, selectedMonth, selectedDay });
		}
	}

	generateYearOptions = () => {
		const { startYear, endYear } = this.state;
		const yearOptions = [];
		yearOptions.push(
			<option
				key={-1}
				value="-1"
				className={
					this.props.classes && this.props.classes.yearOptions ? this.props.classes.yearOptions : null
				}>
				{this.props.defaultValues && this.props.defaultValues.year ? this.props.defaultValues.year : ''}
			</option>
		);
		if (this.props.options && this.props.options.yearReverse) {
			for (let i = endYear; i >= startYear; i--) {
				yearOptions.push(
					<option
						key={i}
						value={i}
						className={
							this.props.classes && this.props.classes.yearOptions ? this.props.classes.yearOptions : null
						}>
						{i}
					</option>
				);
			}
		} else {
			for (let i = startYear; i <= endYear; i++) {
				yearOptions.push(
					<option
						key={i}
						value={i}
						className={
							this.props.classes && this.props.classes.yearOptions ? this.props.classes.yearOptions : null
						}>
						{i}
					</option>
				);
			}
		}
		return yearOptions;
	};

	generateMonthOptions = () => {
		const { startMonth, endMonth, startYear, endYear, selectedYear } = this.state;
		const { options = {} } = this.props;
		const { monthCaps = false, monthShort = false } = options;

		let months = [];
		if (selectedYear === startYear) {
			for (let i = startMonth; i <= 11; i++) {
				months.push({ value: i, label: monthByNumber[i] });
			}
		} else if (selectedYear === endYear) {
			for (let i = 0; i <= endMonth; i++) {
				months.push({ value: i, label: monthByNumber[i] });
			}
		} else {
			for (let i = 0; i <= 11; i++) {
				months.push({ value: i, label: monthByNumber[i] });
			}
		}

		if (monthShort) {
			months = months.map(d => ({ value: d.value, label: d.label.substring(0, 3) }));
		}

		if (monthCaps) {
			months = months.map(d => ({ value: d.value, label: d.label.toUpperCase() }));
		}

		return months;
	};

	generateDayOptions = () => {
		const { startYear, startMonth, startDay, endYear, endMonth, endDay, selectedYear, selectedMonth } = this.state;
		const dayOptions = [];
		let monthDays;
		if (selectedYear === startYear) {
			if (selectedMonth === startMonth) {
				monthDays =
					selectedYear % 4 === 0 && selectedMonth === 1
						? daysInMonth[selectedMonth] + 1
						: daysInMonth[selectedMonth];
				for (let i = startDay; i <= monthDays; i++) {
					dayOptions.push({ label: i, value: i });
				}
			} else {
				monthDays =
					selectedYear % 4 === 0 && selectedMonth === 1
						? daysInMonth[selectedMonth] + 1
						: daysInMonth[selectedMonth];
				for (let i = 1; i <= monthDays; i++) {
					dayOptions.push({ label: i, value: i });
				}
			}
		} else if (selectedYear === endYear) {
			if (selectedMonth === endMonth) {
				for (let i = 1; i <= endDay; i++) {
					dayOptions.push({ label: i, value: i });
				}
			} else {
				monthDays =
					selectedYear % 4 === 0 && selectedMonth === 1
						? daysInMonth[selectedMonth] + 1
						: daysInMonth[selectedMonth];
				for (let i = 1; i <= monthDays; i++) {
					dayOptions.push({ label: i, value: i });
				}
			}
		} else {
			if (selectedMonth) {
				monthDays =
					selectedYear % 4 === 0 && selectedMonth === 1
						? daysInMonth[selectedMonth] + 1
						: daysInMonth[selectedMonth];
				for (let i = 1; i <= monthDays; i++) {
					dayOptions.push({ label: i, value: i });
				}
			} else {
				for (let i = 1; i <= 31; i++) {
					dayOptions.push({ label: i, value: i });
				}
			}
		}
		return dayOptions;
	};

	handleYearChange(year) {
		year = parseInt(year);
		this.setState({ selectedYear: year });
		if (this.props.onYearChange) {
			this.props.onYearChange(year);
		}
		this.handleDateChange(unit.year, year);
	}

	handleMonthChange = month => {
		const { onMonthChange } = this.props;

		month = parseInt(month);
		this.setState({ selectedMonth: month });
		if (onMonthChange) {
			onMonthChange(monthByNumber[month]);
		}
		this.handleDateChange(unit.month, month);
	};

	handleDayChange = day => {
		const { onDayChange } = this.props;

		day = parseInt(day);
		this.setState({ selectedDay: day });
		if (onDayChange) {
			onDayChange(day);
		}
		this.handleDateChange(unit.day, day);
	};

	handleDateChange(type, value) {
		if (this.props.onDateChange) {
			let { selectedYear, selectedMonth, selectedDay } = this.state;
			if (type === unit.year) {
				selectedYear = value;
			} else if (type === unit.month) {
				selectedMonth = value;
			} else if (type === unit.day) {
				selectedDay = value;
			}
			if (selectedYear !== -1 && selectedMonth !== -1 && selectedDay !== -1) {
				this.props.onDateChange(new Date(selectedYear, selectedMonth, selectedDay));
			}
		}
	}

	render() {
		const { selectedDay, selectedMonth } = this.state;
		const { classes = {}, defaultValues = {}, ids = {}, names = {} } = this.props;
		const {
			dateContainer = null,
			day: dayClass = null,
			dayContainer = null,
			month: monthClass = null,
			monthContainer = null
		} = classes;
		const { day: dayId = null, month: monthId = null } = ids;
		const { day: dayName = null, month: monthName = null } = names;
		const { day: defaultDay = null, month: defaultMonth = 'Month' } = defaultValues;

		const monthsOptions = keyBy(this.generateMonthOptions(), 'value');
		const dayOptions = keyBy(this.generateDayOptions(), 'value');

		return (
			<div id="dropdown-date" className={dateContainer}>
				<div id="dropdown-month" className={monthContainer}>
					<Select
						id={monthId}
						name={monthName}
						className={monthClass}
						value={monthsOptions[selectedMonth]}
						onChange={e => this.handleMonthChange(e ? e.value : null)}
						options={values(monthsOptions)}
						placeholder={defaultMonth}
					/>
				</div>
				<div id="dropdown-day" className={dayContainer}>
					<Select
						id={dayId}
						name={dayName}
						className={dayClass}
						value={dayOptions[selectedDay]}
						onChange={e => this.handleDayChange(e ? e.value : null)}
						options={values(dayOptions)}
						placeholder={defaultDay}
					/>
				</div>
				<div
					id="dropdown-year"
					className={
						this.props.classes && this.props.classes.yearContainer ? this.props.classes.yearContainer : null
					}>
					<select
						id={this.props.ids && this.props.ids.year ? this.props.ids.year : null}
						name={this.props.names && this.props.names.year ? this.props.names.year : null}
						className={this.props.classes && this.props.classes.year ? this.props.classes.year : null}
						onChange={e => this.handleYearChange(e.target.value)}
						value={this.state.selectedYear}>
						{this.generateYearOptions()}
					</select>
				</div>
			</div>
		);
	}
}
