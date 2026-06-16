import {
  Button
} from "./chunk-B6RKDGUF.js";
import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/business/FAQSection/index.tsx
import React3 from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown as ChevronDown2, ChevronUp } from "lucide-react";

// src/components/ui/dialog.tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/ui/accordion.tsx
import * as React2 from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx2(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs2(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx2(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx2(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx2("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// src/components/business/FAQSection/index.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var FAQSection = ({
  faqs,
  title = "Perguntas Frequentes",
  description,
  icon: Icon = HelpCircle,
  variant = "default",
  categories,
  className,
  onCategoryChange
}) => {
  const [openItems, setOpenItems] = React3.useState([]);
  const [selectedCategory, setSelectedCategory] = React3.useState(null);
  const filteredFaqs = React3.useMemo(() => {
    if (!selectedCategory || !categories) return faqs;
    return faqs.filter((faq) => faq.category === selectedCategory);
  }, [faqs, selectedCategory, categories]);
  const toggleItem = (itemId) => {
    setOpenItems(
      (prev) => prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOpenItems([]);
    onCategoryChange?.(category);
  };
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "space-y-2";
      case "expanded":
        return "space-y-6";
      default:
        return "space-y-4";
    }
  };
  const getItemStyles = () => {
    switch (variant) {
      case "compact":
        return "p-3 text-sm";
      case "expanded":
        return "p-6 text-lg";
      default:
        return "p-4 text-base";
    }
  };
  return /* @__PURE__ */ jsxs3(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: cn("w-full max-w-4xl mx-auto", className),
      children: [
        (title || description) && /* @__PURE__ */ jsxs3("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx3(Icon, { className: "h-6 w-6 text-primary" }),
            /* @__PURE__ */ jsx3("h2", { className: "text-2xl font-bold", children: title })
          ] }),
          description && /* @__PURE__ */ jsx3("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: description })
        ] }),
        categories && categories.length > 0 && /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap gap-2 justify-center mb-6", children: [
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => handleCategoryChange(null),
              className: cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              ),
              children: "Todas"
            }
          ),
          categories.map((category) => /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => handleCategoryChange(category),
              className: cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              ),
              children: category
            },
            category
          ))
        ] }),
        /* @__PURE__ */ jsx3("div", { className: cn(getVariantStyles()), children: filteredFaqs.map((faq, index) => /* @__PURE__ */ jsx3(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3, delay: index * 0.1 },
            children: variant === "compact" ? (
              // Compact variant - custom accordion
              /* @__PURE__ */ jsxs3("div", { className: "border rounded-lg bg-card", children: [
                /* @__PURE__ */ jsxs3(
                  "button",
                  {
                    onClick: () => toggleItem(faq.id),
                    className: "w-full flex items-center justify-between text-left p-3 hover:bg-accent transition-colors",
                    children: [
                      /* @__PURE__ */ jsx3("span", { className: "font-medium", children: faq.question }),
                      openItems.includes(faq.id) ? /* @__PURE__ */ jsx3(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx3(ChevronDown2, { className: "h-4 w-4" })
                    ]
                  }
                ),
                openItems.includes(faq.id) && /* @__PURE__ */ jsx3(
                  motion.div,
                  {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    transition: { duration: 0.3 },
                    className: "overflow-hidden",
                    children: /* @__PURE__ */ jsx3("div", { className: "p-3 pt-0 text-muted-foreground", children: faq.answer })
                  }
                )
              ] })
            ) : (
              // Default/Expanded variants - use Accordion
              /* @__PURE__ */ jsx3(Accordion, { type: "single", collapsible: true, className: "border rounded-lg bg-card", children: /* @__PURE__ */ jsxs3(AccordionItem, { value: faq.id, children: [
                /* @__PURE__ */ jsx3(AccordionTrigger, { className: cn(
                  "hover:no-underline",
                  getItemStyles()
                ), children: /* @__PURE__ */ jsx3("span", { className: "text-left", children: faq.question }) }),
                /* @__PURE__ */ jsx3(AccordionContent, { className: cn(
                  "text-muted-foreground",
                  variant === "expanded" ? "text-base pb-6" : "text-sm pb-4"
                ), children: faq.answer })
              ] }) })
            )
          },
          faq.id
        )) }),
        filteredFaqs.length === 0 && /* @__PURE__ */ jsx3("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx3("p", { className: "text-muted-foreground", children: "Nenhuma pergunta encontrada para esta categoria." }) })
      ]
    }
  );
};

// src/components/business/BookingDialog/index.tsx
import React4 from "react";
import { motion as motion2, AnimatePresence } from "framer-motion";
import { X as X2, Calendar, Users, CreditCard, MapPin, Clock } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var INITIAL_FORM_DATA = {
  date: "",
  timeSlot: "",
  participants: 1,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  specialRequests: "",
  termsAccepted: false
};
var StepIndicator = ({
  currentStep,
  showSteps
}) => {
  if (!showSteps) return null;
  const steps = [
    { id: "details", label: "Detalhes" },
    { id: "form", label: "Informa\xE7\xF5es" },
    { id: "confirmation", label: "Confirma\xE7\xE3o" }
  ];
  const getCurrentStepIndex = () => steps.findIndex((step) => step.id === currentStep);
  return /* @__PURE__ */ jsx4("div", { className: "flex items-center justify-center mb-6", children: steps.map((step, index) => {
    const currentIndex = getCurrentStepIndex();
    const isActive = currentStep === step.id;
    const isCompleted = currentIndex > index;
    return /* @__PURE__ */ jsxs4(React4.Fragment, { children: [
      /* @__PURE__ */ jsx4("div", { className: cn(
        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
        isActive && "bg-primary text-primary-foreground",
        isCompleted && !isActive && "bg-muted text-muted-foreground",
        !isActive && !isCompleted && "bg-primary/20 text-primary"
      ), children: index + 1 }),
      index < steps.length - 1 && /* @__PURE__ */ jsx4("div", { className: cn(
        "w-8 h-0.5 transition-colors",
        currentIndex > index ? "bg-primary" : "bg-muted"
      ) })
    ] }, step.id);
  }) });
};
var DetailsStep = ({ booking, formatPrice: formatPrice2, currency, onContinue }) => /* @__PURE__ */ jsxs4("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxs4("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx4(Calendar, { className: "h-8 w-8 text-primary" }) }),
    /* @__PURE__ */ jsxs4("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx4("h3", { className: "font-semibold text-lg", children: booking.title }),
      booking.description && /* @__PURE__ */ jsx4("p", { className: "text-muted-foreground mt-1", children: booking.description })
    ] })
  ] }),
  /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
    booking.duration && /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4(Clock, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxs4("span", { className: "text-sm", children: [
        "Dura\xE7\xE3o: ",
        booking.duration
      ] })
    ] }),
    booking.capacity && /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4(Users, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxs4("span", { className: "text-sm", children: [
        "Capacidade: ",
        booking.capacity,
        " pessoas"
      ] })
    ] }),
    booking.location && /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4(MapPin, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxs4("span", { className: "text-sm", children: [
        "Local: ",
        booking.location
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4(CreditCard, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxs4("span", { className: "text-sm font-semibold", children: [
        "Pre\xE7o: ",
        formatPrice2(booking.price, currency)
      ] })
    ] })
  ] }),
  (booking.included?.length || booking.excluded?.length) && /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
    booking.included && booking.included.length > 0 && /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("h4", { className: "font-medium mb-2 text-green-600", children: "Inclu\xEDdo" }),
      /* @__PURE__ */ jsx4("ul", { className: "text-sm space-y-1", children: booking.included.map((item, index) => /* @__PURE__ */ jsxs4("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4("div", { className: "w-1.5 h-1.5 bg-green-600 rounded-full" }),
        item
      ] }, index)) })
    ] }),
    booking.excluded && booking.excluded.length > 0 && /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("h4", { className: "font-medium mb-2 text-red-600", children: "N\xE3o inclu\xEDdo" }),
      /* @__PURE__ */ jsx4("ul", { className: "text-sm space-y-1", children: booking.excluded.map((item, index) => /* @__PURE__ */ jsxs4("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4("div", { className: "w-1.5 h-1.5 bg-red-600 rounded-full" }),
        item
      ] }, index)) })
    ] })
  ] }),
  /* @__PURE__ */ jsx4(Button, { onClick: onContinue, className: "w-full", size: "lg", children: "Continuar" })
] });
var FormStep = ({ booking, formData, setFormData, loading, customFields, onSubmit, isFormValid }) => /* @__PURE__ */ jsxs4("form", { onSubmit, className: "space-y-4", children: [
  booking.availability && /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Data" }),
      /* @__PURE__ */ jsxs4(
        "select",
        {
          value: formData.date,
          onChange: (e) => setFormData((prev) => ({ ...prev, date: e.target.value })),
          className: "w-full p-3 border rounded-md bg-background",
          required: true,
          children: [
            /* @__PURE__ */ jsx4("option", { value: "", children: "Selecione uma data" }),
            booking.availability.dates.map((date) => /* @__PURE__ */ jsx4("option", { value: date, children: date }, date))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Hor\xE1rio" }),
      /* @__PURE__ */ jsxs4(
        "select",
        {
          value: formData.timeSlot,
          onChange: (e) => setFormData((prev) => ({ ...prev, timeSlot: e.target.value })),
          className: "w-full p-3 border rounded-md bg-background",
          required: true,
          children: [
            /* @__PURE__ */ jsx4("option", { value: "", children: "Selecione um hor\xE1rio" }),
            booking.availability.timeSlots.map((slot) => /* @__PURE__ */ jsx4("option", { value: slot, children: slot }, slot))
          ]
        }
      )
    ] })
  ] }),
  /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "N\xFAmero de Participantes" }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        type: "number",
        min: "1",
        max: booking.capacity || 10,
        value: formData.participants,
        onChange: (e) => setFormData((prev) => ({ ...prev, participants: parseInt(e.target.value, 10) })),
        className: "w-full p-3 border rounded-md bg-background",
        required: true
      }
    )
  ] }),
  /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Nome" }),
      /* @__PURE__ */ jsx4(
        "input",
        {
          type: "text",
          value: formData.firstName,
          onChange: (e) => setFormData((prev) => ({ ...prev, firstName: e.target.value })),
          className: "w-full p-3 border rounded-md bg-background",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Sobrenome" }),
      /* @__PURE__ */ jsx4(
        "input",
        {
          type: "text",
          value: formData.lastName,
          onChange: (e) => setFormData((prev) => ({ ...prev, lastName: e.target.value })),
          className: "w-full p-3 border rounded-md bg-background",
          required: true
        }
      )
    ] })
  ] }),
  /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        type: "email",
        value: formData.email,
        onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
        className: "w-full p-3 border rounded-md bg-background",
        required: true
      }
    )
  ] }),
  /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Telefone" }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        type: "tel",
        value: formData.phone,
        onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
        className: "w-full p-3 border rounded-md bg-background",
        required: true
      }
    )
  ] }),
  /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium mb-2", children: "Pedidos Especiais (opcional)" }),
    /* @__PURE__ */ jsx4(
      "textarea",
      {
        value: formData.specialRequests,
        onChange: (e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value })),
        className: "w-full p-3 border rounded-md bg-background min-h-[100px]",
        placeholder: "Informe-nos sobre necessidades especiais ou prefer\xEAncias..."
      }
    )
  ] }),
  customFields,
  /* @__PURE__ */ jsxs4("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsx4(
      "input",
      {
        type: "checkbox",
        id: "terms",
        checked: formData.termsAccepted,
        onChange: (e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked })),
        className: "mt-1",
        required: true
      }
    ),
    /* @__PURE__ */ jsx4("label", { htmlFor: "terms", className: "text-sm text-muted-foreground", children: "Aceito os termos e condi\xE7\xF5es e a pol\xEDtica de privacidade" })
  ] }),
  /* @__PURE__ */ jsx4(
    Button,
    {
      type: "submit",
      disabled: !isFormValid() || loading,
      className: "w-full",
      size: "lg",
      children: loading ? "Processando..." : "Confirmar Reserva"
    }
  )
] });
var ConfirmationStep = ({ booking, formData, formatPrice: formatPrice2, currency, onClose }) => /* @__PURE__ */ jsxs4("div", { className: "text-center space-y-6", children: [
  /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx4("div", { className: "w-8 h-8 bg-green-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx4("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }) }),
  /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx4("h3", { className: "text-xl font-semibold mb-2", children: "Reserva Confirmada!" }),
    /* @__PURE__ */ jsx4("p", { className: "text-muted-foreground", children: "Sua reserva foi confirmada com sucesso. Enviaremos um e-mail com todos os detalhes." })
  ] }),
  /* @__PURE__ */ jsxs4("div", { className: "bg-muted/50 rounded-lg p-4 text-left", children: [
    /* @__PURE__ */ jsx4("h4", { className: "font-medium mb-2", children: "Resumo da Reserva" }),
    /* @__PURE__ */ jsxs4("div", { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx4("span", { children: "Servi\xE7o:" }),
        /* @__PURE__ */ jsx4("span", { className: "font-medium", children: booking.title })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx4("span", { children: "Data:" }),
        /* @__PURE__ */ jsx4("span", { className: "font-medium", children: formData.date })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx4("span", { children: "Hor\xE1rio:" }),
        /* @__PURE__ */ jsx4("span", { className: "font-medium", children: formData.timeSlot })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx4("span", { children: "Participantes:" }),
        /* @__PURE__ */ jsx4("span", { className: "font-medium", children: formData.participants })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between font-semibold text-base pt-2 border-t", children: [
        /* @__PURE__ */ jsx4("span", { children: "Total:" }),
        /* @__PURE__ */ jsx4("span", { children: formatPrice2(booking.price * formData.participants, currency) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsx4(Button, { onClick: onClose, className: "w-full", children: "Fechar" })
] });
var BookingDialog = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
  loading = false,
  currency = "BRL",
  locale = "pt-PT",
  className,
  showSteps = true,
  customFields
}) => {
  const [currentStep, setCurrentStep] = React4.useState("details");
  const [formData, setFormData] = React4.useState(INITIAL_FORM_DATA);
  const formatPrice2 = React4.useCallback((price, curr) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: curr
    }).format(price);
  }, [locale]);
  const isFormValid = React4.useCallback(() => {
    return Boolean(
      formData.date && formData.timeSlot && formData.firstName && formData.lastName && formData.email && formData.phone && formData.termsAccepted
    );
  }, [formData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (showSteps) {
        setCurrentStep("confirmation");
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };
  const resetForm = React4.useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep("details");
  }, []);
  const handleClose = React4.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
  return /* @__PURE__ */ jsx4(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx4(Dialog, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs4(DialogContent, { className: cn(
    "max-w-2xl w-full max-h-[90vh] overflow-y-auto",
    className
  ), children: [
    /* @__PURE__ */ jsx4(DialogHeader, { children: /* @__PURE__ */ jsxs4(DialogTitle, { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx4("span", { children: "Fazer Reserva" }),
      /* @__PURE__ */ jsx4(
        "button",
        {
          onClick: handleClose,
          className: "rounded-full p-2 hover:bg-muted transition-colors",
          "aria-label": "Fechar",
          children: /* @__PURE__ */ jsx4(X2, { className: "h-4 w-4" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx4(StepIndicator, { currentStep, showSteps }),
    /* @__PURE__ */ jsxs4(
      motion2.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        children: [
          currentStep === "details" && /* @__PURE__ */ jsx4(
            DetailsStep,
            {
              booking,
              formatPrice: formatPrice2,
              currency,
              onContinue: () => setCurrentStep("form")
            }
          ),
          currentStep === "form" && /* @__PURE__ */ jsx4(
            FormStep,
            {
              booking,
              formData,
              setFormData,
              loading,
              customFields,
              onSubmit: handleSubmit,
              isFormValid
            }
          ),
          currentStep === "confirmation" && /* @__PURE__ */ jsx4(
            ConfirmationStep,
            {
              booking,
              formData,
              formatPrice: formatPrice2,
              currency,
              onClose: handleClose
            }
          )
        ]
      },
      currentStep
    )
  ] }) }) });
};

// src/components/business/PriceSummary/PriceSummary.tsx
import React5 from "react";
import { motion as motion4 } from "framer-motion";

// src/components/business/PriceSummary/hooks/usePriceCalculations.ts
import { useMemo } from "react";
var usePriceCalculations = (items, showDiscounts = true, showTaxes = true) => {
  return useMemo(() => {
    const getItemsByType = (type) => items.filter((item) => item.type === type);
    const subtotal = getItemsByType("base").reduce((sum, item) => sum + item.amount, 0);
    const discounts = showDiscounts ? getItemsByType("discount").reduce((sum, item) => sum + item.amount, 0) : 0;
    const taxes = showTaxes ? getItemsByType("tax").reduce((sum, item) => sum + item.amount, 0) : 0;
    const fees = getItemsByType("fee").reduce((sum, item) => sum + item.amount, 0);
    const extras = getItemsByType("extra").reduce((sum, item) => sum + item.amount, 0);
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    return {
      subtotal,
      discounts,
      taxes,
      fees,
      extras,
      total,
      getItemsByType
    };
  }, [items, showDiscounts, showTaxes]);
};

// src/components/business/PriceSummary/components/PriceItemRow.tsx
import { Info } from "lucide-react";

// src/components/business/PriceSummary/constants.ts
var ITEM_TYPE_CONFIG = {
  base: {
    icon: "Receipt",
    color: "text-foreground"
  },
  discount: {
    icon: "Percent",
    color: "text-green-600"
  },
  tax: {
    icon: "Calculator",
    color: "text-blue-600"
  },
  fee: {
    icon: "CreditCard",
    color: "text-orange-600"
  },
  extra: {
    icon: "TrendingUp",
    color: "text-purple-600"
  }
};
var ANIMATION_DELAYS = {
  base: 0,
  discount: 0.1,
  tax: 0.2,
  fee: 0.3,
  extra: 0.4,
  total: 0.5
};

// src/components/business/PriceSummary/utils.ts
var formatPrice = (amount, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
};
var getItemIcon = (type) => {
  switch (type) {
    case "base":
      return "Receipt";
    case "discount":
      return "Percent";
    case "tax":
      return "Calculator";
    case "fee":
      return "CreditCard";
    case "extra":
      return "TrendingUp";
    default:
      return "DollarSign";
  }
};
var getItemColor = (type) => {
  switch (type) {
    case "base":
      return ITEM_TYPE_CONFIG.base.color;
    case "discount":
      return ITEM_TYPE_CONFIG.discount.color;
    case "tax":
      return ITEM_TYPE_CONFIG.tax.color;
    case "fee":
      return ITEM_TYPE_CONFIG.fee.color;
    case "extra":
      return ITEM_TYPE_CONFIG.extra.color;
    default:
      return "text-foreground";
  }
};

// src/components/business/PriceSummary/components/PriceItemRow.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var PriceItemRow = ({
  item,
  currency,
  locale,
  onHover,
  showHoverIcon,
  isHovered
}) => /* @__PURE__ */ jsxs5(
  "div",
  {
    className: "flex justify-between items-center py-2 border-b last:border-b-0",
    onMouseEnter: () => onHover?.(item),
    onMouseLeave: () => onHover?.(null),
    children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        getItemIcon(item.type),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("span", { className: "text-sm", children: item.label }),
          item.description && /* @__PURE__ */ jsx5("p", { className: "text-xs text-muted-foreground", children: item.description }),
          item.recurring && item.period && /* @__PURE__ */ jsxs5("span", { className: "text-xs text-muted-foreground", children: [
            "(",
            item.period === "monthly" ? "mensal" : item.period === "yearly" ? "anual" : "di\xE1rio",
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs5("span", { className: cn("font-medium", getItemColor(item.type)), children: [
          item.type === "discount" ? "-" : "",
          formatPrice(item.amount, currency, locale)
        ] }),
        showHoverIcon && isHovered && /* @__PURE__ */ jsx5(Info, { className: "h-3 w-3 text-muted-foreground" })
      ] })
    ]
  }
);

// src/components/business/PriceSummary/components/MinimalView.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var MinimalView = ({
  total,
  currency,
  locale,
  highlightTotal
}) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ jsx6("span", { className: "text-sm text-muted-foreground", children: "Total" }),
  /* @__PURE__ */ jsx6("span", { className: cn(
    "font-bold text-lg",
    highlightTotal && "text-primary"
  ), children: formatPrice(total, currency, locale) })
] });

// src/components/business/PriceSummary/components/CompactView.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var CompactView = ({
  subtotal,
  discounts,
  total,
  currency,
  locale,
  highlightTotal
}) => /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
  /* @__PURE__ */ jsxs7("div", { className: "flex justify-between text-sm", children: [
    /* @__PURE__ */ jsx7("span", { children: "Subtotal" }),
    /* @__PURE__ */ jsx7("span", { children: formatPrice(subtotal, currency, locale) })
  ] }),
  discounts > 0 && /* @__PURE__ */ jsxs7("div", { className: "flex justify-between text-sm text-green-600", children: [
    /* @__PURE__ */ jsx7("span", { children: "Descontos" }),
    /* @__PURE__ */ jsxs7("span", { children: [
      "-",
      formatPrice(discounts, currency, locale)
    ] })
  ] }),
  /* @__PURE__ */ jsxs7("div", { className: cn(
    "flex justify-between font-semibold pt-2 border-t",
    highlightTotal && "text-primary"
  ), children: [
    /* @__PURE__ */ jsx7("span", { children: "Total" }),
    /* @__PURE__ */ jsx7("span", { children: formatPrice(total, currency, locale) })
  ] })
] });

// src/components/business/PriceSummary/components/DefaultView.tsx
import { motion as motion3 } from "framer-motion";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var DefaultView = ({
  calculations,
  currency,
  locale,
  highlightTotal,
  animated
}) => /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
  calculations.getItemsByType("base").map((item) => /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, x: -10 } : false,
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.2, delay: ANIMATION_DELAYS.base },
      className: "flex justify-between items-start",
      children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          getItemIcon(item.type),
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx8("span", { className: "text-sm font-medium", children: item.label }),
            item.description && /* @__PURE__ */ jsx8("p", { className: "text-xs text-muted-foreground", children: item.description }),
            item.recurring && item.period && /* @__PURE__ */ jsxs8("span", { className: "text-xs text-muted-foreground", children: [
              "(",
              item.period === "monthly" ? "mensal" : item.period === "yearly" ? "anual" : "di\xE1rio",
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-medium", children: formatPrice(item.amount, currency, locale) })
      ]
    },
    item.id
  )),
  calculations.discounts > 0 && calculations.getItemsByType("discount").map((item) => /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, x: -10 } : false,
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.2, delay: ANIMATION_DELAYS.discount },
      className: "flex justify-between items-center text-green-600",
      children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          getItemIcon(item.type),
          /* @__PURE__ */ jsx8("span", { className: "text-sm", children: item.label })
        ] }),
        /* @__PURE__ */ jsxs8("span", { className: "font-medium", children: [
          "-",
          formatPrice(item.amount, currency, locale)
        ] })
      ]
    },
    item.id
  )),
  calculations.taxes > 0 && calculations.getItemsByType("tax").map((item) => /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, x: -10 } : false,
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.2, delay: ANIMATION_DELAYS.tax },
      className: "flex justify-between items-center text-blue-600",
      children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          getItemIcon(item.type),
          /* @__PURE__ */ jsx8("span", { className: "text-sm", children: item.label })
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-medium", children: formatPrice(item.amount, currency, locale) })
      ]
    },
    item.id
  )),
  calculations.fees > 0 && calculations.getItemsByType("fee").map((item) => /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, x: -10 } : false,
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.2, delay: ANIMATION_DELAYS.fee },
      className: "flex justify-between items-center text-orange-600",
      children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          getItemIcon(item.type),
          /* @__PURE__ */ jsx8("span", { className: "text-sm", children: item.label })
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-medium", children: formatPrice(item.amount, currency, locale) })
      ]
    },
    item.id
  )),
  calculations.extras > 0 && calculations.getItemsByType("extra").map((item) => /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, x: -10 } : false,
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.2, delay: ANIMATION_DELAYS.extra },
      className: "flex justify-between items-center text-purple-600",
      children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          getItemIcon(item.type),
          /* @__PURE__ */ jsx8("span", { className: "text-sm", children: item.label })
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-medium", children: formatPrice(item.amount, currency, locale) })
      ]
    },
    item.id
  )),
  /* @__PURE__ */ jsxs8(
    motion3.div,
    {
      initial: animated ? { opacity: 0, y: 10 } : false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: ANIMATION_DELAYS.total },
      className: cn(
        "flex justify-between items-center font-bold text-lg pt-3 border-t",
        highlightTotal && "text-primary"
      ),
      children: [
        /* @__PURE__ */ jsx8("span", { children: "Total" }),
        /* @__PURE__ */ jsx8("span", { children: formatPrice(calculations.total, currency, locale) })
      ]
    }
  )
] });

// src/components/business/PriceSummary/components/DetailedView.tsx
import { Info as Info2 } from "lucide-react";

// src/components/business/PriceSummary/components/SummaryCards.tsx
import { Receipt, Percent, Calculator, CreditCard as CreditCard2 } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var SummaryCards = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  currency,
  locale
}) => /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
  /* @__PURE__ */ jsxs9("div", { className: "bg-muted/30 rounded-lg p-3", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx9(Receipt, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-muted-foreground", children: "Base" })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "font-semibold", children: formatPrice(subtotal, currency, locale) })
  ] }),
  discounts > 0 && /* @__PURE__ */ jsxs9("div", { className: "bg-green-50 rounded-lg p-3", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx9(Percent, { className: "h-4 w-4 text-green-600" }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-green-600", children: "Descontos" })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "font-semibold text-green-600", children: [
      "-",
      formatPrice(discounts, currency, locale)
    ] })
  ] }),
  taxes > 0 && /* @__PURE__ */ jsxs9("div", { className: "bg-blue-50 rounded-lg p-3", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx9(Calculator, { className: "h-4 w-4 text-blue-600" }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-blue-600", children: "Impostos" })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "font-semibold text-blue-600", children: formatPrice(taxes, currency, locale) })
  ] }),
  fees + extras > 0 && /* @__PURE__ */ jsxs9("div", { className: "bg-orange-50 rounded-lg p-3", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx9(CreditCard2, { className: "h-4 w-4 text-orange-600" }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-orange-600", children: "Taxas" })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "font-semibold text-orange-600", children: formatPrice(fees + extras, currency, locale) })
  ] })
] });

// src/components/business/PriceSummary/components/DetailedView.tsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var DetailedView = ({
  calculations,
  items,
  currency,
  locale,
  highlightTotal,
  showCalculation,
  onItemHover,
  hoveredItem,
  CalculationBreakdown: CalculationBreakdown2
}) => /* @__PURE__ */ jsxs10("div", { className: "space-y-4", children: [
  /* @__PURE__ */ jsx10(
    SummaryCards,
    {
      subtotal: calculations.subtotal,
      discounts: calculations.discounts,
      taxes: calculations.taxes,
      fees: calculations.fees,
      extras: calculations.extras,
      currency,
      locale
    }
  ),
  /* @__PURE__ */ jsxs10("div", { className: "border rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs10("h4", { className: "font-medium flex items-center gap-2", children: [
      /* @__PURE__ */ jsx10(Info2, { className: "h-4 w-4" }),
      "Detalhamento"
    ] }),
    items.map((item) => /* @__PURE__ */ jsx10(
      PriceItemRow,
      {
        item,
        currency,
        locale,
        onHover: onItemHover,
        showHoverIcon: true,
        isHovered: hoveredItem === item.id
      },
      item.id
    )),
    /* @__PURE__ */ jsxs10("div", { className: cn(
      "flex justify-between items-center font-bold text-lg pt-3 border-t-2",
      highlightTotal && "text-primary"
    ), children: [
      /* @__PURE__ */ jsx10("span", { children: "Total" }),
      /* @__PURE__ */ jsx10("span", { children: formatPrice(calculations.total, currency, locale) })
    ] })
  ] }),
  showCalculation && /* @__PURE__ */ jsx10(
    CalculationBreakdown2,
    {
      subtotal: calculations.subtotal,
      discounts: calculations.discounts,
      taxes: calculations.taxes,
      fees: calculations.fees,
      extras: calculations.extras,
      total: calculations.total,
      currency,
      locale
    }
  )
] });

// src/components/business/PriceSummary/components/CalculationBreakdown.tsx
import { Calculator as Calculator2 } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var CalculationBreakdown = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  total,
  currency,
  locale
}) => /* @__PURE__ */ jsxs11("div", { className: "mt-4 p-3 bg-muted/30 rounded-lg", children: [
  /* @__PURE__ */ jsxs11("h4", { className: "font-medium mb-2 flex items-center gap-2", children: [
    /* @__PURE__ */ jsx11(Calculator2, { className: "h-4 w-4" }),
    "C\xE1lculo"
  ] }),
  /* @__PURE__ */ jsxs11("div", { className: "text-xs space-y-1 font-mono", children: [
    /* @__PURE__ */ jsxs11("div", { children: [
      "Base: ",
      formatPrice(subtotal, currency, locale)
    ] }),
    discounts > 0 && /* @__PURE__ */ jsxs11("div", { className: "text-green-600", children: [
      "- Descontos: ",
      formatPrice(discounts, currency, locale)
    ] }),
    taxes > 0 && /* @__PURE__ */ jsxs11("div", { className: "text-blue-600", children: [
      "+ Impostos: ",
      formatPrice(taxes, currency, locale)
    ] }),
    fees > 0 && /* @__PURE__ */ jsxs11("div", { className: "text-orange-600", children: [
      "+ Taxas: ",
      formatPrice(fees, currency, locale)
    ] }),
    extras > 0 && /* @__PURE__ */ jsxs11("div", { className: "text-purple-600", children: [
      "+ Extras: ",
      formatPrice(extras, currency, locale)
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "font-bold pt-1 border-t", children: [
      "= Total: ",
      formatPrice(total, currency, locale)
    ] })
  ] })
] });

// src/components/business/PriceSummary/PriceSummary.tsx
import { Fragment, jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
var PriceSummary = ({
  items,
  currency = "BRL",
  locale = "pt-PT",
  variant = "default",
  showCalculation = true,
  showTaxes = true,
  showDiscounts = true,
  className,
  onItemHover,
  animated = true,
  highlightTotal = true
}) => {
  const [hoveredItem, setHoveredItem] = React5.useState(null);
  const calculations = usePriceCalculations(items, showDiscounts, showTaxes);
  const handleItemHover = React5.useCallback((item) => {
    setHoveredItem(item?.id ?? null);
    onItemHover?.(item);
  }, [onItemHover]);
  const renderContent = () => {
    const { subtotal, discounts, taxes, fees, extras, total } = calculations;
    switch (variant) {
      case "minimal":
        return /* @__PURE__ */ jsx12(
          MinimalView,
          {
            total,
            currency,
            locale,
            highlightTotal
          }
        );
      case "compact":
        return /* @__PURE__ */ jsx12(
          CompactView,
          {
            subtotal,
            discounts,
            total,
            currency,
            locale,
            highlightTotal
          }
        );
      case "detailed":
        return /* @__PURE__ */ jsx12(
          DetailedView,
          {
            calculations,
            items,
            currency,
            locale,
            highlightTotal,
            showCalculation,
            onItemHover: handleItemHover,
            hoveredItem,
            CalculationBreakdown
          }
        );
      default:
        return /* @__PURE__ */ jsxs12(Fragment, { children: [
          /* @__PURE__ */ jsx12(
            DefaultView,
            {
              calculations,
              currency,
              locale,
              highlightTotal,
              animated
            }
          ),
          showCalculation && /* @__PURE__ */ jsx12(
            CalculationBreakdown,
            {
              subtotal,
              discounts,
              taxes,
              fees,
              extras,
              total,
              currency,
              locale
            }
          )
        ] });
    }
  };
  return /* @__PURE__ */ jsx12(
    motion4.div,
    {
      initial: animated ? { opacity: 0, y: 20 } : false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: animated ? 0.5 : 0 },
      className: cn("bg-card rounded-lg border p-4", className),
      children: renderContent()
    }
  );
};

// src/components/BlogCard.tsx
import { motion as motion5 } from "framer-motion";
import { Calendar as Calendar2, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var BlogCard = ({
  image,
  title,
  excerpt,
  date,
  category = "Viagem",
  onClick,
  className
}) => {
  const CardWrapper = onClick ? motion5.button : motion5.article;
  return /* @__PURE__ */ jsxs13(
    CardWrapper,
    {
      layout: true,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      whileHover: { y: -10 },
      onClick,
      className: clsx(
        "group relative flex flex-col overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 text-left shadow-2xl transition-all duration-500 hover:border-indigo-500/50 hover:shadow-indigo-500/20",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs13("div", { className: "relative aspect-[16/10] overflow-hidden", children: [
          /* @__PURE__ */ jsx13(
            motion5.img,
            {
              whileHover: { scale: 1.1 },
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              src: image,
              alt: `Artigo: ${title}`,
              className: "h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsx13("div", { className: "absolute left-4 top-4 z-10", children: /* @__PURE__ */ jsx13("span", { className: "rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md border border-indigo-500/30", children: category }) }),
          /* @__PURE__ */ jsx13("div", { className: "absolute right-4 top-4 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300", children: /* @__PURE__ */ jsx13("div", { className: "rounded-full bg-white p-2 text-slate-950 shadow-lg", children: /* @__PURE__ */ jsx13(ArrowUpRight, { className: "h-4 w-4" }) }) })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "relative flex flex-1 flex-col p-6", children: [
          /* @__PURE__ */ jsxs13("div", { className: "mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500", children: [
            /* @__PURE__ */ jsx13(Calendar2, { className: "h-3.5 w-3.5 text-indigo-500" }),
            /* @__PURE__ */ jsx13("time", { dateTime: date, children: date })
          ] }),
          /* @__PURE__ */ jsx13("h4", { className: "mb-3 text-xl font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2", children: title }),
          /* @__PURE__ */ jsx13("p", { className: "mb-6 line-clamp-3 text-sm leading-relaxed text-slate-400", children: excerpt }),
          /* @__PURE__ */ jsxs13("div", { className: "mt-auto flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: [
            "Ler Artigo Completo",
            /* @__PURE__ */ jsx13("div", { className: "h-px w-8 bg-indigo-500" })
          ] })
        ] }),
        /* @__PURE__ */ jsx13("div", { className: "absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" })
      ]
    }
  );
};
var BlogCard_default = BlogCard;

export {
  FAQSection,
  BookingDialog,
  PriceSummary,
  BlogCard_default
};
//# sourceMappingURL=chunk-MXRD6MLC.js.map