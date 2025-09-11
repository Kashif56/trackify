import { Helmet } from 'react-helmet-async';

const SEOMetadata = ({ 
  title = 'Trackify - Simple Invoice & Expense Tracking for Small Businesses',
  description = 'Trackify helps freelancers and small businesses create professional invoices, track expenses, and get paid faster without the complexity of traditional accounting software.'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="invoice software, expense tracking, freelancer tools, small business accounting" />
    </Helmet>
  );
};

export default SEOMetadata;
