import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import Chart from 'chart.js/auto';

import { getDashboardStats, getDashboardBalance } from '../../Actions/Dashboard';

import { Modal, Table } from 'antd';
import './Dashboard.css';
import "../../Styles/MainPage.css";
import { ArrowRightOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"));

  const [balanceDate, setBalanceDate] = useState(moment().format('YYYY-MM-DD'));

  const { statsLoading, balanceLoading, stats, balance } = useSelector(state => state.dashboardReducer);

  // Expense Pie Chart
  const pieChartRef1 = useRef(null);
  const pieChartInstance1 = useRef(null);
  useEffect(() => {
    if (pieChartInstance1.current) {
      pieChartInstance1.current.destroy();
    }
    const ctx = pieChartRef1.current.getContext("2d");
    pieChartInstance1.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [...stats?.expenses_list?.map((item) => item.expense_category) || []],
        datasets: [
          {
            data: [...stats?.expenses_list?.map((item) => item.expense_amount) || []],
            backgroundColor: [
              "#064061",
              "#C061B6",
              "#FEDEBF",
              "#4A3AFF",
              "#36BAA6",
            ],
          }
        ],
        hoverOffset: 1
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
        }
      },
    })
    return () => {
      if (pieChartInstance1.current) {
        pieChartInstance1.current.destroy();
      }
    }
  }, [stats]);

  // Purchase By Vendor Pie Chart
  const pieChartRef2 = useRef(null);
  const pieChartInstance2 = useRef(null);
  useEffect(() => {
    if (pieChartInstance2.current) {
      pieChartInstance2.current.destroy();
    }
    const ctx = pieChartRef2.current.getContext("2d");
    pieChartInstance2.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [...stats?.purchases_by_vendors?.map((item) => item.vendor_name) || []],
        datasets: [
          {
            data: [...stats?.purchases_by_vendors?.map((item) => item.purchase_amount) || []],
            backgroundColor: [
              "#F24598",
              "#979696",
              "#4314FF",
              "#FFC93F",
              "#C5C0FF",
            ],
          }
        ],
        hoverOffset: 1
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
        }
      },
    })
    return () => {
      if (pieChartInstance1.current) {
        pieChartInstance1.current.destroy();
      }
    }
  }, [stats]);

  // Sales By Customer Pie Chart
  const pieChartRef3 = useRef(null);
  const pieChartInstance3 = useRef(null);
  useEffect(() => {
    if (pieChartInstance3.current) {
      pieChartInstance3.current.destroy();
    }
    const ctx = pieChartRef3.current.getContext("2d");
    pieChartInstance3.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [...stats?.sales_by_customers?.map((item) => item.customer_name) || []],
        datasets: [
          {
            data: [...stats?.sales_by_customers?.map((item) => item.sales_amount) || []],
            backgroundColor: [
              "#B8ADFF",
              "#C3F7DE",
              "#FCEBB0",
              "#FEC6C6",
              "#333333",
            ],
          }
        ],
        hoverOffset: 1
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
        }
      },
    })
    return () => {
      if (pieChartInstance1.current) {
        pieChartInstance1.current.destroy();
      }
    }
  }, [stats]);

  // Purchase Bar Chart
  const barChartRef1 = useRef(null);
  const barChartInstance1 = useRef(null);
  useEffect(() => {
    if (barChartInstance1.current) {
      barChartInstance1.current.destroy();
    }
    const ctx = barChartRef1.current.getContext("2d");
    const barColor = ['#36BAA6'];

    barChartInstance1.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...stats?.purchases_list?.map((item) => item.month) || []],
        datasets: [
          {
            label: 'Puchases Amount',
            data: [...stats?.purchases_list?.map((item) => item.value) || []],
            backgroundColor: barColor,
          }
        ]
      }
    })
    return () => {
      if (barChartInstance1.current) {
        barChartInstance1.current.destroy();
      }
    }
  }, [stats]);

  // Sales Bar Chart
  const barChartRef2 = useRef(null);
  const barChartInstance2 = useRef(null);
  useEffect(() => {
    if (barChartInstance2.current) {
      barChartInstance2.current.destroy();
    }
    const ctx = barChartRef2.current.getContext("2d");
    const barColor = ['#4A3AFF'];

    barChartInstance2.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...stats?.sales_list?.map((item) => item.month) || []],
        datasets: [
          {
            label: 'Sales Amount',
            data: [...stats?.sales_list?.map((item) => item.value) || []],
            backgroundColor: barColor,
          }
        ]
      }
    })
    return () => {
      if (barChartInstance2.current) {
        barChartInstance2.current.destroy();
      }
    }
  }, [stats]);

  const balanceColumns = [
    {
      title: 'Payment Name',
      dataIndex: 'payment_name',
      key: 'payment_name',
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balance_amount',
      key: 'balance_amount',
      align: 'right',
    },
  ];

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const showBalanceModal = () => {
    setIsBalanceModalOpen(true);
  };
  const handleCancelBalance = () => {
    setIsBalanceModalOpen(false);
    dispatch(getDashboardBalance({
      balance_date: `${balanceDate}T00:00:00.000Z`
    }));
  };

  useEffect(() => {
    dispatch(getDashboardBalance({
      balance_date: `${balanceDate}T00:00:00.000Z`
    }))
  }, [dispatch, balanceDate]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getDashboardStats({
        start_date: `${startDate}T00:00:00.000Z`,
        end_date: `${endDate}T23:59:59.000Z`
      }));
    }
  }, [dispatch, startDate, endDate]);


  return (
    <>
      <div className='mainPage__header'>
        <div className='mainPage__header--left'>
          <h1 className='mainPage__header--title'> Dashboard </h1>
        </div>
      </div>
      <Modal
        open={isBalanceModalOpen}
        onCancel={handleCancelBalance}
        footer={null}
        width={800}
        className='mainPage__list--delete--modal'
      >
        <h1>
          Balance on {moment(balanceDate).format('DD MMM YYYY')}
        </h1>
        <br />
        <Table
          columns={balanceColumns}
          pagination={false}
          sticky={true}
          scroll={{ y: 400 }}
          loading={balanceLoading}
          dataSource={balance}
        />
      </Modal>
      <div className='dashboard__main'>
        <div className='read__customer--statements--header-dates'>
          <input type="date"
            name='startDate'
            placeholder='Start Date'
            defaultValue={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <ArrowRightOutlined />
          <input type="date"
            name='endDate'
            placeholder='End Date'
            defaultValue={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className='dashboard__main--blocks'>
          <div className='dashboard__main--block_row'>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>
                Balance as on
                <input
                  className='dashboard__main--block_heading--input'
                  type="date"
                  name='balanceDate'
                  placeholder='Balance Date'
                  defaultValue={balanceDate}
                  max={moment().format('YYYY-MM-DD')}
                  onChange={(e) => setBalanceDate(e.target.value)}
                />
              </div>
              <div className='dashboard__main--block_data balance_table' onClick={showBalanceModal}>
                {
                  balanceLoading ?
                    <div className="loader"></div>
                    :
                    <Table
                      columns={balanceColumns}
                      pagination={false}
                      sticky={true}
                      scroll={{ y: 300 }}
                      loading={balanceLoading}
                      dataSource={balance?.slice(0, 5)}
                      showHeader={false}
                    />
                }
              </div>
            </div>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>Expense</div>
              <div className='dashboard__main--block_data'>
                {
                  statsLoading ?
                    <div className="loader"></div> :
                    stats?.expenses_list?.length === 0 ?
                      <div className='dashboard__main--no_data'>
                        <PieChartOutlined />
                        <p>No Data</p>
                        <canvas className='sudo__hide' ref={pieChartRef1} />
                      </div> :
                      <div className='dashboard__main--block_piechart_data'>
                        <canvas ref={pieChartRef1} />
                      </div>
                }
              </div>
            </div>
          </div>
          <div className='dashboard__main--block_row'>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>Purchase</div>
              <div className='dashboard__main--block_data'>
                {
                  statsLoading ?
                    <div className="loader"></div> :
                    stats?.purchases_list?.length === 0 ?
                      <div className='dashboard__main--no_data'>
                        <BarChartOutlined />
                        <p>No Data</p>
                        <canvas className='sudo__hide' ref={barChartRef1} />
                      </div> :
                      <div className='dashboard__main--block_barchart_data'>
                        <canvas ref={barChartRef1} />
                      </div>
                }
              </div>
            </div>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>Sales</div>
              <div className='dashboard__main--block_data'>
                {
                  statsLoading ?
                    <div className="loader"></div> :
                    stats?.sales_list?.length === 0 ?
                      <div className='dashboard__main--no_data'>
                        <BarChartOutlined />
                        <p>No Data</p>
                        <canvas className='sudo__hide' ref={barChartRef2} />
                      </div> :
                      <div className='dashboard__main--block_barchart_data'>
                        <canvas ref={barChartRef2} />
                      </div>
                }
              </div>
            </div>
          </div>
          <div className='dashboard__main--block_row'>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>Puchases by Vendor</div>
              <div className='dashboard__main--block_data'>
                {
                  statsLoading ?
                    <div className="loader"></div> :
                    stats?.purchases_by_vendors?.length === 0 ?
                      <div className='dashboard__main--no_data'>
                        <PieChartOutlined />
                        <p>No Data</p>
                        <canvas className='sudo__hide' ref={pieChartRef2} />
                      </div> :
                      <div className='dashboard__main--block_piechart_data'>
                        <canvas ref={pieChartRef2} />
                      </div>
                }
              </div>
            </div>
            <div className='dashboard__main--single_block'>
              <div className='dashboard__main--block_heading'>Sales by Customer</div>
              <div className='dashboard__main--block_data'>
                {
                  statsLoading ?
                    <div className="loader"></div> :
                    stats?.sales_by_customers?.length === 0 ?
                      <div className='dashboard__main--no_data'>
                        <PieChartOutlined />
                        <p>No Data</p>
                        <canvas className='sudo__hide' ref={pieChartRef3} />
                      </div> :
                      <div className='dashboard__main--block_piechart_data'>
                        <canvas ref={pieChartRef3} />
                      </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
