import moment from "moment";

import { View, Text } from '@react-pdf/renderer'

const ReadHead = ({ title, styles, address_line_1, address_line_2, address_line_3, company_name, country, state, vat_trn, corporate_tax_trn, number, date, valid_till, due_date, reference }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                {/* <Text style={styles.mainLeftHeading}>
                    {title} From
                </Text> */}
                <Text style={styles.mainLeftCompany}>
                    {company_name}
                </Text>
                <Text>{address_line_1}</Text>
                { address_line_2 && <Text>{address_line_2}</Text>}
                { address_line_3 && <Text>{address_line_3}</Text>}
                <Text>{state + ', ' + country}</Text>
                { vat_trn && <Text>VAT TRN: {vat_trn}</Text>}
                { corporate_tax_trn && <Text>Corporate Tax TRN: {corporate_tax_trn}</Text>}
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightData}>
                    <Text>{title} Number</Text>
                    <Text>{title} Date</Text>
                    {due_date ? <Text>Due Date</Text> : <Text>Valid Till</Text>}
                    {reference ? <Text>Reference</Text> : ""}
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{number}</Text>
                    <Text>{moment(date).format("DD-MM-YYYY")}</Text>
                    {due_date ? <Text>{moment(due_date).format("DD-MM-YYYY")}</Text> : <Text>{moment(valid_till).format("DD-MM-YYYY")}</Text>}
                    {reference ? <Text>{reference}</Text> : ""}
                </View>
            </View>
        </View >
    )
}

export default ReadHead;
