import { View, Text } from '@react-pdf/renderer'

const PaymentFor = ({ styles, currency_abv, customer_name, billing_address_line_1, billing_address_line_2, billing_address_line_3, billing_state, billing_country, trn, invoice_mappings, total_amount, amount_in_words }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    <Text>
                        Receipt For
                    </Text>
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>{customer_name}</Text>
                    <Text>{billing_address_line_1}</Text>
                    {billing_address_line_2 && <Text>{billing_address_line_2}</Text>}
                    {billing_address_line_3 && <Text>{billing_address_line_3}</Text>}
                    <Text>{billing_state + ', ' + billing_country}</Text>
                    {trn && <Text>TRN: {trn}</Text>}
                </View>
            </View>
            <View style={styles.mainMiddle}>
                <View style={styles.mainMiddleHeading}>
                    <Text>Invoices</Text>
                </View>
                <View style={styles.mainMiddleData}>
                    <View style={styles.mainMiddleDataHeading}>
                        <Text style={styles.mainMiddleDataHeadingText}>Invoice</Text>
                        <Text style={styles.mainMiddleDataHeadingText}>Amount Received</Text>
                    </View>
                    <View style={styles.mainMiddleDataValue}>
                        {invoice_mappings?.map((item, index) => (
                            <View key={index} style={styles.mainMiddleDataValueItem}>
                                <Text style={styles.mainMiddleDataValueItemText}>{item.invoice_number}</Text>
                                <Text style={styles.mainMiddleDataValueItemText}>{currency_abv} {item.amount}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightHeading1}>
                    <Text>Amount Received</Text>
                </View>
                <View style={styles.mainRightValue1}>
                    <Text>{total_amount}</Text>
                </View>
                <View style={styles.mainRightHeading2}>
                    <Text>Amount Received (In Words)</Text>
                </View>
                <View style={styles.mainRightValue2}>
                    <Text>{amount_in_words}</Text>
                </View>
            </View>
        </View>
    )
}

export default PaymentFor
