import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const CustomerStatement = () => {
    return (
        <div className="read__customer--transaction">
            <div>
                <RangePicker
                    // showTime={false}
                    // format="YYYY-MM-DD"
                    // onChange={onChange}
                    // onOk={onOk}
                />
            </div>
        </div>
    )
}

export default CustomerStatement;
