'use client';

import React from 'react';
import { Form, FormItemProps, Col, Row } from 'antd';

export interface MobileFieldProps extends Omit<FormItemProps, 'className'> {
  /**
   * Field name
   */
  name: string | string[];
  /**
   * Field label
   */
  label: string;
  /**
   * Form input/control
   */
  children: React.ReactNode;
  /**
   * Span on desktop (1-24)
   * @default 24 (full width)
   */
  span?: number;
  /**
   * Make this field full width on all screen sizes
   * @default true
   */
  fullWidthOnMobile?: boolean;
}

interface MobileFormProps {
  /**
   * Form fields configuration
   */
  fields: MobileFieldProps[];
  /**
   * Form instance from antd
   */
  form?: any;
  /**
   * Form layout
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /**
   * Gap between form sections
   * @default 'medium'
   */
  spacing?: 'small' | 'medium' | 'large';
  /**
   * Additional form props
   */
  formProps?: React.ComponentProps<typeof Form>;
}

/**
 * MobileForm - Form component optimized for mobile with stacked fields
 *
 * This component automatically stacks form fields vertically on mobile devices
 * while allowing custom grid layouts on larger screens. All fields are full-width
 * on mobile by default, improving touch target accessibility.
 *
 * @example
 * <MobileForm
 *   form={form}
 *   fields={[
 *     {
 *       name: 'firstName',
 *       label: 'First Name',
 *       rules: [{ required: true }],
 *       children: <Input placeholder="Enter first name" />,
 *     },
 *     {
 *       name: 'lastName',
 *       label: 'Last Name',
 *       rules: [{ required: true }],
 *       span: 12, // Half width on desktop
 *       children: <Input placeholder="Enter last name" />,
 *     },
 *   ]}
 * />
 */
export function MobileForm({
  fields,
  form,
  layout = 'vertical',
  spacing = 'medium',
  formProps,
}: MobileFormProps) {
  const spacingClasses = {
    small: 'space-y-2',
    medium: 'space-y-4',
    large: 'space-y-6',
  };

  return (
    <Form form={form} layout={layout} {...formProps}>
      <div className={`${spacingClasses[spacing]} ${layout === 'vertical' ? '' : 'sm:space-y-0'}`}>
        {fields.map((field, index) => {
          const { span = 24, fullWidthOnMobile = true, children, ...formItemProps } = field;

          // On mobile, all fields are full width
          // On desktop, use the specified span
          const mobileCol = fullWidthOnMobile ? 24 : span;
          const desktopCol = span;

          return (
            <Col
              key={Array.isArray(field.name) ? field.name.join('.') : field.name}
              xs={mobileCol}
              sm={mobileCol}
              md={desktopCol}
              lg={desktopCol}
            >
              <Form.Item
                {...formItemProps}
                className={layout === 'vertical' ? 'mb-0' : ''}
              >
                {children}
              </Form.Item>
            </Col>
          );
        })}
      </div>
    </Form>
  );
}

/**
 * MobileFieldWrapper - Wrapper for individual form fields with responsive spacing
 */
interface MobileFieldWrapperProps {
  label?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}

export function MobileFieldWrapper({
  label,
  required,
  error,
  helper,
  children,
}: MobileFieldWrapperProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}

/**
 * MobileFormActions - Bottom action bar for forms with sticky behavior on mobile
 */
interface MobileFormActionsProps {
  children: React.ReactNode;
  /**
   * Make the action bar stick to bottom on mobile
   * @default true
   */
  sticky?: boolean;
  /**
   * Position of actions
   * @default 'right'
   */
  align?: 'left' | 'center' | 'right' | 'space-between';
}

export function MobileFormActions({
  children,
  sticky = true,
  align = 'right',
}: MobileFormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  return (
    <div
      className={`${sticky ? 'sticky bottom-0' : ''} bg-white border-t border-gray-200 pt-4 pb-4 px-4 sm:px-6 mt-6 z-10`}
    >
      <div className={`flex flex-col sm:flex-row gap-3 ${alignClasses[align]}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * MobileSection - Form section with responsive spacing
 */
interface MobileSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  /**
   * Spacing after section
   * @default 'medium'
   */
  spacing?: 'small' | 'medium' | 'large';
}

export function MobileSection({
  title,
  description,
  children,
  spacing = 'medium',
}: MobileSectionProps) {
  const spacingClasses = {
    small: 'mb-4',
    medium: 'mb-6',
    large: 'mb-8',
  };

  return (
    <div className={`${spacingClasses[spacing]}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
