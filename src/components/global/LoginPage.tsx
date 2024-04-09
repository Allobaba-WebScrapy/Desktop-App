"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast"
import { Card } from "../ui/card"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { login, setCookie } from "@/state/auth/AuthSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { ModeToggle } from "../mode-toggle"
import { checkCookie } from "@/lib/SecureCredentiels";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your code must be 6 characters.",
  }),
})

export default function LoginPage() {
  const stateCode = useSelector((state: RootState) => state.auth.code)
  const isLogin = useSelector((state: RootState) => state.auth.isLogin)
  const dispatch = useDispatch()
  const navigate = useNavigate()



  useEffect(() => {
    if (checkCookie("user", stateCode)) {
      dispatch(login())
      navigate("/scrapy")
    }
  }, [isLogin])


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (stateCode !== data.code) {
      toast({
        variant: "destructive",
        title: "Code is Incorrect",
        description: "Please enter the correct code.",
      })
      return
    } else {
      dispatch(setCookie())
      dispatch(login())
      navigate("/scrapy")
    }
  }

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <Toaster />
      <Card className="h-[50vh] w-[380px] sm:w-[500px] md:w-[660px] 2xl:w-[660px] flex flex-col items-center gap-11 justify-center">
        <div className="absolute right-8 top-4">
          <ModeToggle />
        </div>
        <div className="flex gap-[1px] dark:gap-0 items-center scale-150">
          <img src="/scrapy-allobaba.png" alt="Scrapy" className="h-10" />
          <span className="text-2xl dark:text-xl font-bold relative dark:right-1">
            crapy
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[90%] space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-4 justify-center items-center">
                  <FormLabel>Please enter the code to allow access to this webSite.</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="w-full flex justify-center items-center">
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={0} />
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={1} />
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={2} />
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={3} />
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={4} />
                        <InputOTPSlot className="hidden-password border-neutral-600 text-base font-semibold" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full text-base" type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
