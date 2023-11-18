import { Table } from 'antd';

const TableCard = ({ columns, dispatch, loading, items, getList, searchText, customer_id, role, client_id, showAll }) => {
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
                if (getList === undefined) return;
                if (customer_id) {
                    dispatch(getList(pagination.current, "", customer_id));
                } else if (searchText) {
                    searchText.length > 2 ? dispatch(getList(pagination.current, searchText)) : dispatch(getList(pagination.current));
                } else if (client_id) {
                    dispatch(getList(pagination.current, "", 0, role, client_id, showAll));
                }
            }}
        />
    )
}

export default TableCard
