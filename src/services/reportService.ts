import { 
  productsService as productService, 
  salesService, 
  clientsService, 
  paymentsService as paymentService, 
  expenseService,
  suppliersService as supplierService 
} from './supabaseService';

export const reportService = {
    async generateSalesReport(startDate: string, endDate: string) {
        // Fetch sales data from Supabase
        const salesData = await salesService.getAll();

        // Filter sales data based on the provided date range
        const filteredSales = salesData.filter(sale => {
            const saleDate = new Date(sale.sale_date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return saleDate >= start && saleDate <= end;
        });

        // Calculate total revenue
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);

        // Group sales by product
        const salesByProduct = filteredSales.reduce((acc, sale) => {
            const productName = sale.products?.product_name || 'Unknown Product';
            if (!acc[productName]) {
                acc[productName] = {
                    productName,
                    quantitySold: 0,
                    revenue: 0,
                };
            }
            acc[productName].quantitySold += sale.quantity_sold;
            acc[productName].revenue += sale.total_amount;
            return acc;
        }, {});

        // Convert salesByProduct to an array
        const salesByProductArray = Object.values(salesByProduct);

        return {
            totalRevenue,
            salesByProduct: salesByProductArray,
            startDate,
            endDate,
        };
    },

    async generateInventoryReport() {
        // Fetch product and inventory data from Supabase
        const products = await productService.getAll();

        // Calculate total number of products
        const totalProducts = products.length;

        // Calculate total value of inventory
        let totalInventoryValue = 0;
        for (const product of products) {
            totalInventoryValue += product.price;
        }

        return {
            totalProducts,
            totalInventoryValue,
        };
    },

    async generateClientReport() {
        // Fetch client data from Supabase
        const clients = await clientsService.getAll();

        // Calculate total number of clients
        const totalClients = clients.length;

        return {
            totalClients,
        };
    },

    async generatePaymentReport(startDate: string, endDate: string) {
        // Fetch payment data from Supabase
        const payments = await paymentService.getAll();

        // Filter payments data based on the provided date range
        const filteredPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.payment_date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return paymentDate >= start && paymentDate <= end;
        });

        // Calculate total amount received
        const totalAmountReceived = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
            totalAmountReceived,
            startDate,
            endDate,
        };
    },
};
