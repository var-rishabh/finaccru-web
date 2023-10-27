import React from 'react'
import { View, Text } from '@react-pdf/renderer'

const TaxInvoiceHead = ({ styles, address_line_1, address_line_2, address_line_3, company_name, country, state, trade_license_number, ti_number, ti_date, due_date, reference }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <Text style={styles.mainLeftHeading}>
                    Tax Invoice From
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
                    <Text>Tax Invoice Number</Text>
                    <Text>Tax Invoice Date</Text>
                    <Text>Due Date</Text>
                    {reference ? <Text>Reference</Text> : ""}
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{ti_number}</Text>
                    <Text>{ti_date}</Text>
                    <Text>{due_date}</Text>
                    {reference ? <Text>{reference}</Text> : ""}
                </View>
            </View>
        </View>
    )
}

export default TaxInvoiceHead;
