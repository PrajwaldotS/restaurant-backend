import type { Context } from "koa";

export default {
  async analytics(ctx: Context) {
    try {
      // Get all picked orders with items populated
      const orders = await strapi.entityService.findMany(
        "api::order.order",
        {
          filters: {
            status_food: "picked", // only completed orders
          },
          populate: {
            items: true,
          },
        }
      );

      let totalRevenue = 0;
      let categoryRevenue: Record<string, number> = {};
      let itemCount: Record<string, number> = {};
      let revenueByDate: Record<string, number> = {};

      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt)
          .toISOString()
          .split("T")[0];

        if (!revenueByDate[orderDate]) {
          revenueByDate[orderDate] = 0;
        }

        order.items?.forEach((item: any) => {
          const price = Number(item.Price);
          totalRevenue += price;

          // Category Revenue
          const category = item.Category?.trim() || "Unknown";
          if (!categoryRevenue[category]) {
            categoryRevenue[category] = 0;
          }
          categoryRevenue[category] += price;

          // Item Count
          if (!itemCount[item.Name]) {
            itemCount[item.Name] = 0;
          }
          itemCount[item.Name] += 1;

          // Revenue by Date
          revenueByDate[orderDate] += price;
        });
      });

      // Top Selling Items (sorted)
      const topSelling = Object.entries(itemCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      ctx.body = {
        totalOrders: orders.length,
        totalRevenue,
        categoryRevenue,
        topSelling,
        revenueByDate,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};