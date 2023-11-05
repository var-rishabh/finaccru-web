import { View, Text } from '@react-pdf/renderer'

const PaymentHead = ({ styles, address_line_1, address_line_2, address_line_3, company_name, country, state, trade_license_number, payment_number, payment_date }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <Text style={styles.mainLeftHeading}>
                    Receipt From
                </Text>
                <Text style={styles.mainLeftCompany}>
                    {company_name}
                </Text>
                <Text>{address_line_1}</Text>
                <Text>{address_line_2}</Text>
                <Text>{address_line_3}</Text>
                <Text>{state + ', ' + country}</Text>
                <Text>TRN: {trade_license_number}</Text>
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightData}>
                    <Text>Receipt Number</Text>
                    <Text>Receipt Date</Text>
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{payment_number}</Text>
                    <Text>{payment_date}</Text>
                </View>
            </View>
        </View>
    )
}

export default PaymentHead;
