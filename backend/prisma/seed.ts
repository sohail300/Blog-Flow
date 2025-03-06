import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcryptjs from "bcryptjs";

export default async function seedDatabase(c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Clear existing data to prevent duplicates
    await prisma.blog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.subscription.deleteMany();

    // Generate hashed passwords
    const hashedPasswords = {
      john: await bcryptjs.hash("password123", 10),
      jane: await bcryptjs.hash("securepass456", 10),
      mike: await bcryptjs.hash("bloggerlife789", 10),
    };

    // Seed Users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: hashedPasswords.john,
          photourl: "https://example.com/john.jpg",
          isVerified: true,
          emailNotificationsEnabled: true,
        },
      }),
      prisma.user.create({
        data: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          password: hashedPasswords.jane,
          photourl: "https://example.com/jane.jpg",
          isVerified: true,
          emailNotificationsEnabled: false,
        },
      }),
      prisma.user.create({
        data: {
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          password: hashedPasswords.mike,
          isVerified: false,
          verificationOTP: 123456,
          expiryVerificationOTP: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      }),
    ]);

    // Seed Blogs
    await prisma.blog.createMany({
      data: [
        {
          title: "Introduction to Web Development",
          description: "A beginner's guide to web development",
          content: "Web development is an exciting field...",
          published: true,
          authorId: users[0].id,
          photourl: "https://example.com/webdev.jpg",
        },
        {
          title: "Machine Learning Basics",
          description: "Understanding the fundamentals of ML",
          content: "Machine learning is transforming industries...",
          published: true,
          authorId: users[1].id,
          photourl: "https://example.com/ml.jpg",
        },
        {
          title: "Unpublished Draft",
          description: "A work in progress",
          content: "This is a draft blog post...",
          published: false,
          authorId: users[0].id,
        },
      ],
    });

    // Seed Subscriptions
    await prisma.subscription.createMany({
      data: [
        { email: "reader1@example.com" },
        { email: "reader2@example.com" },
        { email: "reader3@example.com" },
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
