import React from 'react'
import { View, Text } from '@react-pdf/renderer'
const TaxInvoiceMeta = ({ styles, currency_abv, currency_conversion_rate, subject }) => {
    return (
        <View style={styles.main}>
            <View style={styles.main1}>
                <View style={styles.main1Heading}>
                    <Text>Currency</Text>
                </View>
                <View style={styles.main1Data}>
                    <Text>1</Text>
                    <Text>{currency_abv} =</Text>
                    <Text>{currency_conversion_rate}</Text>
                    <Text>AED</Text>
                </View>
            </View>
            <View style={styles.main2}>
                {
                    subject ?
                        <View>
                            <View style={styles.main2Heading}>
                                <Text>Subject</Text>
                            </View>
                            <View style={styles.main2Data}>
                                <Text>{subject}</Text>
                            </View>
                        </View>
                        : ""
                }
            </View>
        </View>
    )
}

export default TaxInvoiceMeta;
