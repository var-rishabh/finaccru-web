import React from 'react'
import { View, Text } from '@react-pdf/renderer'

const EstimateHead = ({ address_line_1, address_line_2, address_line_3, company_name, country, state, trade_license_number, estimate_number, estimate_date, valid_till, reference }) => {
    return (
        <View className='read__estimate--part1-head'>
            <View className='read__estimate--head-info1'>
                <Text>Estimate From</Text>
                <Text style={{ fontWeight: 500 }}>{company_name}</Text>
                <Text>{address_line_1}</Text>
                <Text>{address_line_2}</Text>
                <Text>{address_line_3}</Text>
                <Text>{state + ', ' + country}</Text>
                <Text>TRN: {trade_license_number}</Text>
            </View>
            <View className='read__estimate--head-info2'>
                <View className='read__estimate--head-info2-data'>
                    <Text>Estimate Number</Text>
                    <Text>
                        {estimate_number}
                    </Text>
                </View>
                <View className='read__estimate--head-info2-data'>
                    <Text>Estimate Date</Text>
                    <Text>{estimate_date}</Text>
                </View>
                <View className='read__estimate--head-info2-data'>
                    <Text>Valid Till</Text>
                    <Text>{valid_till}</Text>
                </View>
                <View className='read__estimate--head-info2-data'>
                    {
                        reference ?
                            <>
                                <Text>Reference</Text>
                                <Text>{reference}</Text>
                            </>
                            : ""
                    }
                </View>
            </View>
        </View>
    )
}

export default EstimateHead
