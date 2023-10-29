import React from 'react'
import { View, Text } from '@react-pdf/renderer'

const EstimateHead = ({ styles, address_line_1, address_line_2, address_line_3, company_name, country, state, trade_license_number, estimate_number, estimate_date, valid_till, reference }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <Text style={styles.mainLeftHeading}>
                    Estimate From
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
                    <Text>Estimate Number</Text>
                    <Text>Estimate Date</Text>
                    <Text>Valid Till</Text>
                    {reference ? <Text>Reference</Text> : ""}
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{estimate_number}</Text>
                    <Text>{estimate_date}</Text>
                    <Text>{valid_till}</Text>
                    {reference ? <Text>{reference}</Text> : ""}
                </View>
            </View>
        </View>
    )
}

export default EstimateHead
