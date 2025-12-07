'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { convertBase } from '@/lib/calculators/base';

type FormValues = {
  decimal: string;
  binary: string;
  octal: string;
  hexadecimal: string;
};

export function BaseConverter() {
  const form = useForm<FormValues>({
    defaultValues: {
      decimal: '',
      binary: '',
      octal: '',
      hexadecimal: '',
    },
  });

  const handleValueChange = (
    value: string,
    fromBase: 'decimal' | 'binary' | 'octal' | 'hexadecimal'
  ) => {
    if (value === '') {
      form.reset({
        decimal: '',
        binary: '',
        octal: '',
        hexadecimal: '',
      });
      return;
    }

    const newValues: FormValues = {
      decimal: '',
      binary: '',
      octal: '',
      hexadecimal: '',
    };
    
    const bases: (keyof FormValues)[] = ['decimal', 'binary', 'octal', 'hexadecimal'];
    
    bases.forEach(toBase => {
        newValues[toBase] = convertBase(value, fromBase, toBase) || '';
    });
    
    // Set all values at once to prevent infinite loops
    Object.entries(newValues).forEach(([name, val]) => {
      form.setValue(name as keyof FormValues, val, { shouldValidate: true });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="decimal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleValueChange(e.target.value, 'decimal')}
                      placeholder="e.g., 10"
                      className="font-code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="binary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Binary</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleValueChange(e.target.value, 'binary')}
                      placeholder="e.g., 1010"
                      className="font-code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="octal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Octal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleValueChange(e.target.value, 'octal')}
                      placeholder="e.g., 12"
                      className="font-code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hexadecimal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hexadecimal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        handleValueChange(e.target.value, 'hexadecimal')
                      }
                      placeholder="e.g., A"
                      className="font-code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
