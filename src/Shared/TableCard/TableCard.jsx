import { Table } from 'antd';

const TableCard = ({ columns, dispatch, loading, items, getList, searchText, customer_id }) => {
    return (
        <Table
            columns={columns}
            pagination={{
                position: ['bottomCenter'],
                pageSize: 20,
                total: items?.total_items,
                defaultCurrent: 1,
                showSizeChanger: false,
            }}
            sticky={true}
            scroll={{ y: 550 }}
            loading={loading}
            dataSource={items?.items}
            onChange={(pagination) => {
                if (customer_id) {
                    dispatch(getList(pagination.current, "", customer_id));
                } else {
                    searchText.length > 2 ? dispatch(getList(pagination.current, searchText)) : dispatch(getList(pagination.current));
                }
            }}
        />
    )
}

export default TableCard
