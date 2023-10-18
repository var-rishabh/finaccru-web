import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer'
import logo from "../../assets/Icons/cropped_logo.svg"
const styles = StyleSheet.create({
  page: {
    // flexDirection: 'column',
  },
  header: {
    padding: "16px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  header__image: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  header__text: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 'bold', // Set the font weight to bold
  },

  section: {
    marginBottom: 10,
  },
  read__estimate__footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    backgroundColor: "#C9EFD8",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px"
  },
  read__estimate__footer__text: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  read__estimate__footer__image: {
    width: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

const PdfContent = ({ content }) => {
  const contentPerPage = 600; // Set the maximum height of content per page (adjust as needed)

  const pages = [];

  let currentPage = [];
  let currentHeight = 0;

  content.forEach((section) => {
    const sectionHeight = 30; // Adjust as needed

    if (currentHeight + sectionHeight > contentPerPage) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(section);
    currentHeight += sectionHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <Document>
      {pages.map((pageContent, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.header__image}>
              <Image style={{ width: "120px" }} src={"https://res.cloudinary.com/dn2jk5smj/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1697376786/cropped_logo_wfg22r.jpg?_s=public-apps"} alt="logo" />
            </View>
            <View style={styles.header__text}>
              <Text style={{ fontWeight: "bold", fontSize: "20px" }}>Estimates</Text>
            </View>
          </View>

          {pageContent.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text>{section}</Text>
            </View>
          ))}

          <View style={styles.read__estimate__footer}>
            <View style={styles.read__estimate__footer__image}>
              <Image style={{ width: "60px" }} src={"https://res.cloudinary.com/dn2jk5smj/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1697376786/cropped_logo_wfg22r.jpg?_s=public-apps"} alt="logo" />
            </View>
            <View style={styles.read__estimate__footer__text}>
              <Text style={{ fontWeight: "400", fontSize: "10px" }}> This is electronically generated document and does not require sign or stamp. </Text>
              <Text style={{ marginTop: "12px", fontWeight: "bold", fontSize: "10px" }}> powered by Finaccru </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PdfContent;
