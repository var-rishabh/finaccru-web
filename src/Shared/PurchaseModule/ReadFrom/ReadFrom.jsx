import { View, Text } from '@react-pdf/renderer'

const ReadHead = ({ title, styles, address_line_1, address_line_2, address_line_3, company_name, country, state, trade_license_number, number, date, expected_delivery_date }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <Text style={styles.mainLeftHeading}>
                    {title} From
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
                    <Text>{title} Number</Text>
                    <Text>{title} Date</Text>
                    <Text>Expected Date</Text>
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{number}</Text>
                    <Text>{date}</Text>
                    <Text>{expected_delivery_date}</Text>
                </View>
            </View>
        </View >
    )
}

export default ReadHead;
