import { View, Text } from '@react-pdf/renderer'

const StatementHead = ({ styles, customer, user }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    <Text>To</Text>
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>{customer?.customer_name}</Text>
                    <Text>{customer?.billing_address_line_1}</Text>
                    {customer?.billing_address_line_2 && <Text>{customer?.billing_address_line_2}</Text>}
                    {customer?.billing_address_line_3 && <Text>{customer?.billing_address_line_3}</Text>}
                    <Text>{customer?.billing_state + ', ' + customer?.billing_country}</Text>
                    {customer?.trn && <Text>TRN: {customer?.trn}</Text>}
                </View>
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightData}>
                    <Text style={styles.mainLeftCustomer}>{user?.full_name}</Text>
                    <Text>{user?.company_data?.address_line_1}</Text>
                    {user?.company_data?.address_line_2 && <Text>{user?.company_data?.address_line_2}</Text>}
                    {user?.company_data?.address_line_3 && <Text>{user?.company_data?.address_line_3}</Text>}
                    <Text>{user?.company_data?.state + ', ' + user?.company_data?.country}</Text>
                    {user?.company_data?.trade_license_number && <Text>TRN: {user?.company_data?.trade_license_number}</Text>}
                </View>
            </View>
        </View>
    )
}

export default StatementHead;
