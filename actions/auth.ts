"use server";

import { AuthService } from "@/lib/auth";
import { db } from "@/lib/db";
import { SignInSchema, signInSchema } from "@/validations/sign-in.validation";
import { SignUpSchema, signUpSchema } from "@/validations/sign-up.validation";
import { compareSync, hashSync } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function signUpActions(values: SignUpSchema): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const validation = signUpSchema.safeParse(values);

    if (!validation.success) {
      return {
        success: false,
        message: "Bad Request",
      };
    }

    const { email, password, firstname, lastname, telephone, student_id } =
      validation.data;

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword = hashSync(password, 10);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstname,
        lastName: lastname,
        phone: telephone,
        studentId: student_id,
        image: "/userimage/boy.png",
        role: "MEMBER",
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Register successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function signInActions(values: SignInSchema): Promise<{
  success: boolean;
  message: string;
  redirectTo?: string; // เพิ่ม redirect path
}> {
  try {
    const validation = signInSchema.safeParse(values);

    if (!validation.success) {
      return {
        success: false,
        message: "Bad Request",
      };
    }

    const { email, password } = validation.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !compareSync(password, user.password ?? "")) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    await AuthService.createSessionCookies(user.id, user.role);

    // ตรวจสอบบทบาทของผู้ใช้
    let redirectTo = "/";
    if (user.role === "ADMIN") {
      redirectTo = "/admin/company-list"; // หากเป็น admin
    } else if (user.role === "MEMBER") {
      redirectTo = "/"; // หากเป็นสมาชิกทั่วไป
    }

    revalidatePath(redirectTo); // Revalidate หน้าใหม่

    return {
      success: true,
      message: "login successfully",
      redirectTo, // ส่งกลับเส้นทาง
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function signOutActions() {
  await AuthService.clearSession();
  revalidatePath("/");
}
