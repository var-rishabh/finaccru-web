import { View, Text } from '@react-pdf/renderer'

const ReadFor = ({title, styles, vendor_name, customer_name, billing_address_line_1, billing_address_line_2, billing_address_line_3, billing_state, billing_country, shipping_address_line_1, shipping_address_line_2, shipping_address_line_3, shipping_state, shipping_country, trn }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    <Text>
                        Billing Address
                    </Text>
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>{vendor_name ? vendor_name : customer_name}</Text>
                    <Text>{billing_address_line_1}</Text>
                    {billing_address_line_2 && <Text>{billing_address_line_2}</Text>}
                    {billing_address_line_3 && <Text>{billing_address_line_3}</Text>}
                    <Text>{billing_state + ', ' + billing_country}</Text>
                    {trn && <Text>TRN: {trn}</Text>}
                </View>
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightHeading}>
                    <Text>Shipping Address</Text>
                </View>
                <View style={styles.mainRightData}>
                    <Text>{shipping_address_line_1}</Text>
                    {shipping_address_line_2 && <Text>{shipping_address_line_2}</Text>}
                    {shipping_address_line_3 && <Text>{shipping_address_line_3}</Text>}
                    <Text>{shipping_state + ', ' + shipping_country}</Text>
                </View>
            </View>
        </View>
    )
}

export default ReadFor;
