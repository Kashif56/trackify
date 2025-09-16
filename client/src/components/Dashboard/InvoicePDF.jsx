import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#666',
  },
  infoBlock: {
    marginBottom: 20,
    width: '50%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
  },
  addressBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addressColumn: {
    width: '50%',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
  },
  tableCell: {
    fontSize: 11,
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  summaryTable: {
    width: '50%',
    alignSelf: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  summaryLabel: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  summaryValue: {
    textAlign: 'right',
    width: '30%',
  },
  totalRow: {
    fontWeight: 'bold',
    fontSize: 14,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderTopStyle: 'solid',
    paddingTop: 5,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  notes: {
    fontSize: 11,
    color: '#666',
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  bankDetails: {
    fontSize: 11,
    marginBottom: 20,
  },
  bankDetailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  termsContainer: {
    fontSize: 11,
    color: '#666',
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  paymentTerms: {
    fontSize: 11,
    marginBottom: 20,
  },
  paymentTermsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  conditions: {
    fontSize: 11,
  },
  conditionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  status: {
    position: 'absolute',
    top: 40,
    right: 30,
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 1,
    color: '#dc2626',
  },
});

// Format currency based on user preference
const formatCurrency = (amount, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM dd, yyyy');
};

// Invoice PDF Document
const InvoicePDF = ({ invoice, user, client, bankDetails }) => {
  // Get user's currency preference
  const currencyCode = user?.profile?.currency === 'pkr' ? 'PKR' : 'USD';
  // Calculate subtotal
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  
  // Calculate tax amount
  const taxAmount = subtotal * (invoice.tax_rate / 100);
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#16a34a'; // green
      case 'overdue':
        return '#dc2626'; // red
      default:
        return '#f59e0b'; // amber/yellow
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
            <Text style={[styles.status, { color: getStatusColor(invoice.status) }]}>{invoice.status.toUpperCase()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {user?.profile_picture && (
                <Image
                    src={user.profile_picture}
                    style={styles.logo}
                />
                )}
            {user?.company_name && (
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}> 
                {user.company_name}
              </Text>
            )}
            
            <Text>
                {user.first_name} {user.last_name}
            </Text>
            <Text>
                {user.email}
            </Text>
            <Text>
                {user.address}
            </Text>

          </View>
        </View>
        
       
        
        {/* From/To Addresses */}
        <View style={styles.addressBlock}>
 
          <View style={styles.addressColumn}>
            <Text style={styles.addressTitle}>To:</Text>
            <Text style={styles.addressText}>{client?.name}</Text>
            {client?.company_name && <Text style={styles.addressText}>{client.company_name}</Text>}
            {client?.address && <Text style={styles.addressText}>{client.address}</Text>}
            {client?.city && (
              <Text style={styles.addressText}>
                {client.city}, {client.state} {client.zip_code}
              </Text>
            )}
            {client?.country && <Text style={styles.addressText}>{client.country}</Text>}
            {client?.phone_number && <Text style={styles.addressText}>{client.phone_number}</Text>}
            {client?.email && <Text style={styles.addressText}>{client.email}</Text>}
          </View>

           {/* Invoice Info */}
            <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Date:</Text>
                <Text style={styles.infoValue}>{formatDate(invoice.issue_date)}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Due Date:</Text>
                <Text style={styles.infoValue}>{formatDate(invoice.due_date)}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Text>
            </View>
            </View>
        </View>
        
        {/* Invoice Items */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Unit Price</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
          </View>
          
          {/* Table Rows */}
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(item.unit_price, currencyCode)}</Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {formatCurrency(item.quantity * item.unit_price, currencyCode)}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Summary */}
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal, currencyCode)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax ({invoice.tax_rate}%):</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxAmount, currencyCode)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(invoice.total, currencyCode)}</Text>
          </View>
        </View>
        
        {/* Additional Information - 2 Column Layout */}
        <View style={styles.additionalInfoContainer}>
          {/* Left Column - Bank Details and Notes */}
          <View style={styles.leftColumn}>
            {/* Bank Details */}
            {bankDetails && (
              <View style={[styles.bankDetails, styles.sectionBox]}>
                <Text style={styles.bankDetailsTitle}>Bank Details</Text>
                <Text>Account Name: {bankDetails.accountName}</Text>
                <Text>Account Number: {bankDetails.accountNumber}</Text>
                <Text>Bank Name: {bankDetails.bankName}</Text>
                {bankDetails.swiftCode && <Text>Swift Code: {bankDetails.swiftCode}</Text>}
                {bankDetails.routingNumber && <Text>Routing Number: {bankDetails.routingNumber}</Text>}
              </View>
            )}
            
            {/* Notes */}
            {invoice.notes && (
              <View style={[styles.notes, styles.sectionBox]}>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text>{invoice.notes}</Text>
              </View>
            )}
          </View>
          
          {/* Right Column - Payment Terms and Conditions */}
          <View style={styles.rightColumn}>
            {/* Payment Terms */}
            {invoice.payment_terms && (
              <View style={[styles.paymentTerms, styles.sectionBox]}>
                <Text style={styles.paymentTermsTitle}>Payment Terms</Text>
                <Text>{invoice.payment_terms}</Text>
              </View>
            )}
            
            {/* Terms & Conditions */}
            {invoice.conditions && (
              <View style={[styles.conditions, styles.sectionBox]}>
                <Text style={styles.conditionsTitle}>Terms & Conditions</Text>
                <Text>{invoice.conditions}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
