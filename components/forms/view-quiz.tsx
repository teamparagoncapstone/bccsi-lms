'use client'
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnswerSchema } from "@/validators/ans";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const inter = Inter({ subsets: ["latin"] });
type Input = z.infer<typeof AnswerSchema>;

export default function StartQuiz() {
  const { toast } = useToast();
  const [formStep, setFormStep] = React.useState(0);
  const form = useForm<Input>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      Option1: "",
      Option2: "",
      Option3: "",
    },
  });

  function onSubmit(data: Input) {
    if (!data.Option1 || !data.Option2 || !data.Option3) {
      toast({
        title: "Please select all answers",
        variant: "destructive",
      });
      return;
    }
    alert(JSON.stringify(data, null, 4));
    console.log(data);
  }
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button size='lg' className="mb-2 mt-2 mr-2 drop-shadow-2xl shadow-black transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">Start Quiz</Button>
        </DialogTrigger>
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
    <DialogContent className="sm:max-w-[650px]">
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Sample Activities</CardTitle>
          <CardDescription>Please answer the following questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative space-y-3 overflow-x-hidden"
            >
              <motion.div
                className={cn("space-y-3", {
                })}
                
                animate={{
                  translateX: `-${formStep * 100}%`,
                }}
                transition={{
                  ease: "easeInOut",
                }}
              >
                <FormField
                  control={form.control}
                  name="Option1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-bold">1+1=</FormLabel>
                      <FormControl>
                      <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">2</Label>
                      </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">6</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">8</Label>
                    </div>
                    </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Option2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-bold">2+2=</FormLabel>
                      <FormControl>
                      <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">1</Label>
                      </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">3</Label>
                    </div>
                    </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Option3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-bold">3+3=</FormLabel>
                      <FormControl>
                        <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">6</Label>
                      </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">9</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">10</Label>
                    </div>
                    </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
              </motion.div>
              <motion.div
                className={cn("space-y-3 absolute top-0 left-0 right-0", {
                
                })}
                animate={{
                  translateX: `${100 - formStep * 100}%`,
                }}
                style={{
                  translateX: `${100 - formStep * 100}%`,
                }}
                transition={{
                  ease: "easeInOut",
                }}
              >
              </motion.div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className={cn({
                    hidden: formStep == 0,
                  })}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant={"ghost"}
                  className={cn({
                    hidden: formStep == 1,
                  })}
                  onClick={() => {
                    // validation
                    form.trigger(["Option1", "Option2", "Option3"]);
                    const Option1State = form.getFieldState("Option1");
                    const Option2State = form.getFieldState("Option2");
                    const Option3State = form.getFieldState("Option3");

                    if (!Option1State.isDirty || Option1State.invalid) return;
                    if (!Option2State.isDirty || Option2State.invalid) return;
                    if (!Option3State.isDirty || Option3State.invalid) return;

                    setFormStep(1);
                  }} 
                >
                  Submit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => {
                    setFormStep(0);
                  }}
                  className={cn({
                    hidden: formStep == 0,
                  })}
                >
                  Go Back
                </Button>
                
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </DialogContent>
    </div>
    </Dialog>
  );
}