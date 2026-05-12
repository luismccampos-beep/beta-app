import {
  Button
} from "./chunk-F3UNIGPC.js";
import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/business/FAQSection/index.tsx
import React4 from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown as ChevronDown2, ChevronUp } from "lucide-react";

// src/components/ui/dialog.tsx
import * as React2 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React2.createElement(
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
var DialogContent = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ React2.createElement(DialogPortal, null, /* @__PURE__ */ React2.createElement(DialogOverlay, null), /* @__PURE__ */ React2.createElement(
  DialogPrimitive.Content,
  {
    ref,
    className: cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
      className
    ),
    ...props
  },
  children,
  /* @__PURE__ */ React2.createElement(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" }, /* @__PURE__ */ React2.createElement(X, { className: "h-4 w-4" }), /* @__PURE__ */ React2.createElement("span", { className: "sr-only" }, "Close"))
)));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ React2.createElement(
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
}) => /* @__PURE__ */ React2.createElement(
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
var DialogTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React2.createElement(
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
var DialogDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React2.createElement(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/ui/accordion.tsx
import * as React3 from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React3.createElement(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ React3.createElement(AccordionPrimitive.Header, { className: "flex" }, /* @__PURE__ */ React3.createElement(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props
  },
  children,
  /* @__PURE__ */ React3.createElement(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
)));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ React3.createElement(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props
  },
  /* @__PURE__ */ React3.createElement("div", { className: cn("pb-4 pt-0", className) }, children)
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// src/components/business/FAQSection/index.tsx
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
  const [openItems, setOpenItems] = React4.useState([]);
  const [selectedCategory, setSelectedCategory] = React4.useState(null);
  const filteredFaqs = React4.useMemo(() => {
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
  return /* @__PURE__ */ React4.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: cn("w-full max-w-4xl mx-auto", className)
    },
    (title || description) && /* @__PURE__ */ React4.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React4.createElement("div", { className: "flex items-center justify-center gap-2 mb-4" }, /* @__PURE__ */ React4.createElement(Icon, { className: "h-6 w-6 text-primary" }), /* @__PURE__ */ React4.createElement("h2", { className: "text-2xl font-bold" }, title)), description && /* @__PURE__ */ React4.createElement("p", { className: "text-muted-foreground max-w-2xl mx-auto" }, description)),
    categories && categories.length > 0 && /* @__PURE__ */ React4.createElement("div", { className: "flex flex-wrap gap-2 justify-center mb-6" }, /* @__PURE__ */ React4.createElement(
      "button",
      {
        onClick: () => handleCategoryChange(null),
        className: cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )
      },
      "Todas"
    ), categories.map((category) => /* @__PURE__ */ React4.createElement(
      "button",
      {
        key: category,
        onClick: () => handleCategoryChange(category),
        className: cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )
      },
      category
    ))),
    /* @__PURE__ */ React4.createElement("div", { className: cn(getVariantStyles()) }, filteredFaqs.map((faq, index) => /* @__PURE__ */ React4.createElement(
      motion.div,
      {
        key: faq.id,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.1 }
      },
      variant === "compact" ? (
        // Compact variant - custom accordion
        /* @__PURE__ */ React4.createElement("div", { className: "border rounded-lg bg-card" }, /* @__PURE__ */ React4.createElement(
          "button",
          {
            onClick: () => toggleItem(faq.id),
            className: "w-full flex items-center justify-between text-left p-3 hover:bg-accent transition-colors"
          },
          /* @__PURE__ */ React4.createElement("span", { className: "font-medium" }, faq.question),
          openItems.includes(faq.id) ? /* @__PURE__ */ React4.createElement(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ React4.createElement(ChevronDown2, { className: "h-4 w-4" })
        ), openItems.includes(faq.id) && /* @__PURE__ */ React4.createElement(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            transition: { duration: 0.3 },
            className: "overflow-hidden"
          },
          /* @__PURE__ */ React4.createElement("div", { className: "p-3 pt-0 text-muted-foreground" }, faq.answer)
        ))
      ) : (
        // Default/Expanded variants - use Accordion
        /* @__PURE__ */ React4.createElement(Accordion, { type: "single", collapsible: true, className: "border rounded-lg bg-card" }, /* @__PURE__ */ React4.createElement(AccordionItem, { value: faq.id }, /* @__PURE__ */ React4.createElement(AccordionTrigger, { className: cn(
          "hover:no-underline",
          getItemStyles()
        ) }, /* @__PURE__ */ React4.createElement("span", { className: "text-left" }, faq.question)), /* @__PURE__ */ React4.createElement(AccordionContent, { className: cn(
          "text-muted-foreground",
          variant === "expanded" ? "text-base pb-6" : "text-sm pb-4"
        ) }, faq.answer)))
      )
    ))),
    filteredFaqs.length === 0 && /* @__PURE__ */ React4.createElement("div", { className: "text-center py-8" }, /* @__PURE__ */ React4.createElement("p", { className: "text-muted-foreground" }, "Nenhuma pergunta encontrada para esta categoria."))
  );
};

// src/components/business/BookingDialog/index.tsx
import React5 from "react";
import { motion as motion2, AnimatePresence } from "framer-motion";
import { X as X2, Calendar, Users, CreditCard, MapPin, Clock } from "lucide-react";
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
  return /* @__PURE__ */ React5.createElement("div", { className: "flex items-center justify-center mb-6" }, steps.map((step, index) => {
    const currentIndex = getCurrentStepIndex();
    const isActive = currentStep === step.id;
    const isCompleted = currentIndex > index;
    return /* @__PURE__ */ React5.createElement(React5.Fragment, { key: step.id }, /* @__PURE__ */ React5.createElement("div", { className: cn(
      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
      isActive && "bg-primary text-primary-foreground",
      isCompleted && !isActive && "bg-muted text-muted-foreground",
      !isActive && !isCompleted && "bg-primary/20 text-primary"
    ) }, index + 1), index < steps.length - 1 && /* @__PURE__ */ React5.createElement("div", { className: cn(
      "w-8 h-0.5 transition-colors",
      currentIndex > index ? "bg-primary" : "bg-muted"
    ) }));
  }));
};
var DetailsStep = ({ booking, formatPrice: formatPrice2, currency, onContinue }) => /* @__PURE__ */ React5.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React5.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React5.createElement("div", { className: "w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center" }, /* @__PURE__ */ React5.createElement(Calendar, { className: "h-8 w-8 text-primary" })), /* @__PURE__ */ React5.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React5.createElement("h3", { className: "font-semibold text-lg" }, booking.title), booking.description && /* @__PURE__ */ React5.createElement("p", { className: "text-muted-foreground mt-1" }, booking.description))), /* @__PURE__ */ React5.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, booking.duration && /* @__PURE__ */ React5.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(Clock, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React5.createElement("span", { className: "text-sm" }, "Dura\xE7\xE3o: ", booking.duration)), booking.capacity && /* @__PURE__ */ React5.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(Users, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React5.createElement("span", { className: "text-sm" }, "Capacidade: ", booking.capacity, " pessoas")), booking.location && /* @__PURE__ */ React5.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(MapPin, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React5.createElement("span", { className: "text-sm" }, "Local: ", booking.location)), /* @__PURE__ */ React5.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(CreditCard, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React5.createElement("span", { className: "text-sm font-semibold" }, "Pre\xE7o: ", formatPrice2(booking.price, currency)))), (booking.included?.length || booking.excluded?.length) && /* @__PURE__ */ React5.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, booking.included && booking.included.length > 0 && /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("h4", { className: "font-medium mb-2 text-green-600" }, "Inclu\xEDdo"), /* @__PURE__ */ React5.createElement("ul", { className: "text-sm space-y-1" }, booking.included.map((item, index) => /* @__PURE__ */ React5.createElement("li", { key: index, className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement("div", { className: "w-1.5 h-1.5 bg-green-600 rounded-full" }), item)))), booking.excluded && booking.excluded.length > 0 && /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("h4", { className: "font-medium mb-2 text-red-600" }, "N\xE3o inclu\xEDdo"), /* @__PURE__ */ React5.createElement("ul", { className: "text-sm space-y-1" }, booking.excluded.map((item, index) => /* @__PURE__ */ React5.createElement("li", { key: index, className: "flex items-center gap-2" }, /* @__PURE__ */ React5.createElement("div", { className: "w-1.5 h-1.5 bg-red-600 rounded-full" }), item))))), /* @__PURE__ */ React5.createElement(Button, { onClick: onContinue, className: "w-full", size: "lg" }, "Continuar"));
var FormStep = ({ booking, formData, setFormData, loading, customFields, onSubmit, isFormValid }) => /* @__PURE__ */ React5.createElement("form", { onSubmit, className: "space-y-4" }, booking.availability && /* @__PURE__ */ React5.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Data"), /* @__PURE__ */ React5.createElement(
  "select",
  {
    value: formData.date,
    onChange: (e) => setFormData((prev) => ({ ...prev, date: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  },
  /* @__PURE__ */ React5.createElement("option", { value: "" }, "Selecione uma data"),
  booking.availability.dates.map((date) => /* @__PURE__ */ React5.createElement("option", { key: date, value: date }, date))
)), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Hor\xE1rio"), /* @__PURE__ */ React5.createElement(
  "select",
  {
    value: formData.timeSlot,
    onChange: (e) => setFormData((prev) => ({ ...prev, timeSlot: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  },
  /* @__PURE__ */ React5.createElement("option", { value: "" }, "Selecione um hor\xE1rio"),
  booking.availability.timeSlots.map((slot) => /* @__PURE__ */ React5.createElement("option", { key: slot, value: slot }, slot))
))), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "N\xFAmero de Participantes"), /* @__PURE__ */ React5.createElement(
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
)), /* @__PURE__ */ React5.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Nome"), /* @__PURE__ */ React5.createElement(
  "input",
  {
    type: "text",
    value: formData.firstName,
    onChange: (e) => setFormData((prev) => ({ ...prev, firstName: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  }
)), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Sobrenome"), /* @__PURE__ */ React5.createElement(
  "input",
  {
    type: "text",
    value: formData.lastName,
    onChange: (e) => setFormData((prev) => ({ ...prev, lastName: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  }
))), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "E-mail"), /* @__PURE__ */ React5.createElement(
  "input",
  {
    type: "email",
    value: formData.email,
    onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  }
)), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Telefone"), /* @__PURE__ */ React5.createElement(
  "input",
  {
    type: "tel",
    value: formData.phone,
    onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background",
    required: true
  }
)), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", { className: "block text-sm font-medium mb-2" }, "Pedidos Especiais (opcional)"), /* @__PURE__ */ React5.createElement(
  "textarea",
  {
    value: formData.specialRequests,
    onChange: (e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value })),
    className: "w-full p-3 border rounded-md bg-background min-h-[100px]",
    placeholder: "Informe-nos sobre necessidades especiais ou prefer\xEAncias..."
  }
)), customFields, /* @__PURE__ */ React5.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ React5.createElement(
  "input",
  {
    type: "checkbox",
    id: "terms",
    checked: formData.termsAccepted,
    onChange: (e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked })),
    className: "mt-1",
    required: true
  }
), /* @__PURE__ */ React5.createElement("label", { htmlFor: "terms", className: "text-sm text-muted-foreground" }, "Aceito os termos e condi\xE7\xF5es e a pol\xEDtica de privacidade")), /* @__PURE__ */ React5.createElement(
  Button,
  {
    type: "submit",
    disabled: !isFormValid() || loading,
    className: "w-full",
    size: "lg"
  },
  loading ? "Processando..." : "Confirmar Reserva"
));
var ConfirmationStep = ({ booking, formData, formatPrice: formatPrice2, currency, onClose }) => /* @__PURE__ */ React5.createElement("div", { className: "text-center space-y-6" }, /* @__PURE__ */ React5.createElement("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto" }, /* @__PURE__ */ React5.createElement("div", { className: "w-8 h-8 bg-green-600 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React5.createElement("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React5.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })))), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("h3", { className: "text-xl font-semibold mb-2" }, "Reserva Confirmada!"), /* @__PURE__ */ React5.createElement("p", { className: "text-muted-foreground" }, "Sua reserva foi confirmada com sucesso. Enviaremos um e-mail com todos os detalhes.")), /* @__PURE__ */ React5.createElement("div", { className: "bg-muted/50 rounded-lg p-4 text-left" }, /* @__PURE__ */ React5.createElement("h4", { className: "font-medium mb-2" }, "Resumo da Reserva"), /* @__PURE__ */ React5.createElement("div", { className: "space-y-2 text-sm" }, /* @__PURE__ */ React5.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React5.createElement("span", null, "Servi\xE7o:"), /* @__PURE__ */ React5.createElement("span", { className: "font-medium" }, booking.title)), /* @__PURE__ */ React5.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React5.createElement("span", null, "Data:"), /* @__PURE__ */ React5.createElement("span", { className: "font-medium" }, formData.date)), /* @__PURE__ */ React5.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React5.createElement("span", null, "Hor\xE1rio:"), /* @__PURE__ */ React5.createElement("span", { className: "font-medium" }, formData.timeSlot)), /* @__PURE__ */ React5.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React5.createElement("span", null, "Participantes:"), /* @__PURE__ */ React5.createElement("span", { className: "font-medium" }, formData.participants)), /* @__PURE__ */ React5.createElement("div", { className: "flex justify-between font-semibold text-base pt-2 border-t" }, /* @__PURE__ */ React5.createElement("span", null, "Total:"), /* @__PURE__ */ React5.createElement("span", null, formatPrice2(booking.price * formData.participants, currency))))), /* @__PURE__ */ React5.createElement(Button, { onClick: onClose, className: "w-full" }, "Fechar"));
var BookingDialog = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
  loading = false,
  currency = "BRL",
  locale = "pt-BR",
  className,
  showSteps = true,
  customFields
}) => {
  const [currentStep, setCurrentStep] = React5.useState("details");
  const [formData, setFormData] = React5.useState(INITIAL_FORM_DATA);
  const formatPrice2 = React5.useCallback((price, curr) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: curr
    }).format(price);
  }, [locale]);
  const isFormValid = React5.useCallback(() => {
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
  const resetForm = React5.useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep("details");
  }, []);
  const handleClose = React5.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
  return /* @__PURE__ */ React5.createElement(AnimatePresence, null, isOpen && /* @__PURE__ */ React5.createElement(Dialog, { open: isOpen, onOpenChange: handleClose }, /* @__PURE__ */ React5.createElement(DialogContent, { className: cn(
    "max-w-2xl w-full max-h-[90vh] overflow-y-auto",
    className
  ) }, /* @__PURE__ */ React5.createElement(DialogHeader, null, /* @__PURE__ */ React5.createElement(DialogTitle, { className: "flex items-center justify-between" }, /* @__PURE__ */ React5.createElement("span", null, "Fazer Reserva"), /* @__PURE__ */ React5.createElement(
    "button",
    {
      onClick: handleClose,
      className: "rounded-full p-2 hover:bg-muted transition-colors",
      "aria-label": "Fechar"
    },
    /* @__PURE__ */ React5.createElement(X2, { className: "h-4 w-4" })
  ))), /* @__PURE__ */ React5.createElement(StepIndicator, { currentStep, showSteps }), /* @__PURE__ */ React5.createElement(
    motion2.div,
    {
      key: currentStep,
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3 }
    },
    currentStep === "details" && /* @__PURE__ */ React5.createElement(
      DetailsStep,
      {
        booking,
        formatPrice: formatPrice2,
        currency,
        onContinue: () => setCurrentStep("form")
      }
    ),
    currentStep === "form" && /* @__PURE__ */ React5.createElement(
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
    currentStep === "confirmation" && /* @__PURE__ */ React5.createElement(
      ConfirmationStep,
      {
        booking,
        formData,
        formatPrice: formatPrice2,
        currency,
        onClose: handleClose
      }
    )
  ))));
};

// src/components/business/PriceSummary/PriceSummary.tsx
import React13 from "react";
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
import React6 from "react";
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
var PriceItemRow = ({
  item,
  currency,
  locale,
  onHover,
  showHoverIcon,
  isHovered
}) => /* @__PURE__ */ React6.createElement(
  "div",
  {
    className: "flex justify-between items-center py-2 border-b last:border-b-0",
    onMouseEnter: () => onHover?.(item),
    onMouseLeave: () => onHover?.(null)
  },
  /* @__PURE__ */ React6.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React6.createElement("div", null, /* @__PURE__ */ React6.createElement("span", { className: "text-sm" }, item.label), item.description && /* @__PURE__ */ React6.createElement("p", { className: "text-xs text-muted-foreground" }, item.description), item.recurring && item.period && /* @__PURE__ */ React6.createElement("span", { className: "text-xs text-muted-foreground" }, "(", item.period === "monthly" ? "mensal" : item.period === "yearly" ? "anual" : "di\xE1rio", ")"))),
  /* @__PURE__ */ React6.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React6.createElement("span", { className: cn("font-medium", getItemColor(item.type)) }, item.type === "discount" ? "-" : "", formatPrice(item.amount, currency, locale)), showHoverIcon && isHovered && /* @__PURE__ */ React6.createElement(Info, { className: "h-3 w-3 text-muted-foreground" }))
);

// src/components/business/PriceSummary/components/MinimalView.tsx
import React7 from "react";
var MinimalView = ({
  total,
  currency,
  locale,
  highlightTotal
}) => /* @__PURE__ */ React7.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React7.createElement("span", { className: "text-sm text-muted-foreground" }, "Total"), /* @__PURE__ */ React7.createElement("span", { className: cn(
  "font-bold text-lg",
  highlightTotal && "text-primary"
) }, formatPrice(total, currency, locale)));

// src/components/business/PriceSummary/components/CompactView.tsx
import React8 from "react";
var CompactView = ({
  subtotal,
  discounts,
  total,
  currency,
  locale,
  highlightTotal
}) => /* @__PURE__ */ React8.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React8.createElement("div", { className: "flex justify-between text-sm" }, /* @__PURE__ */ React8.createElement("span", null, "Subtotal"), /* @__PURE__ */ React8.createElement("span", null, formatPrice(subtotal, currency, locale))), discounts > 0 && /* @__PURE__ */ React8.createElement("div", { className: "flex justify-between text-sm text-green-600" }, /* @__PURE__ */ React8.createElement("span", null, "Descontos"), /* @__PURE__ */ React8.createElement("span", null, "-", formatPrice(discounts, currency, locale))), /* @__PURE__ */ React8.createElement("div", { className: cn(
  "flex justify-between font-semibold pt-2 border-t",
  highlightTotal && "text-primary"
) }, /* @__PURE__ */ React8.createElement("span", null, "Total"), /* @__PURE__ */ React8.createElement("span", null, formatPrice(total, currency, locale))));

// src/components/business/PriceSummary/components/DefaultView.tsx
import React9 from "react";
import { motion as motion3 } from "framer-motion";
var DefaultView = ({
  calculations,
  currency,
  locale,
  highlightTotal,
  animated
}) => /* @__PURE__ */ React9.createElement("div", { className: "space-y-3" }, calculations.getItemsByType("base").map((item) => /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    key: item.id,
    initial: animated ? { opacity: 0, x: -10 } : false,
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: ANIMATION_DELAYS.base },
    className: "flex justify-between items-start"
  },
  /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React9.createElement("div", null, /* @__PURE__ */ React9.createElement("span", { className: "text-sm font-medium" }, item.label), item.description && /* @__PURE__ */ React9.createElement("p", { className: "text-xs text-muted-foreground" }, item.description), item.recurring && item.period && /* @__PURE__ */ React9.createElement("span", { className: "text-xs text-muted-foreground" }, "(", item.period === "monthly" ? "mensal" : item.period === "yearly" ? "anual" : "di\xE1rio", ")"))),
  /* @__PURE__ */ React9.createElement("span", { className: "font-medium" }, formatPrice(item.amount, currency, locale))
)), calculations.discounts > 0 && calculations.getItemsByType("discount").map((item) => /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    key: item.id,
    initial: animated ? { opacity: 0, x: -10 } : false,
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: ANIMATION_DELAYS.discount },
    className: "flex justify-between items-center text-green-600"
  },
  /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React9.createElement("span", { className: "text-sm" }, item.label)),
  /* @__PURE__ */ React9.createElement("span", { className: "font-medium" }, "-", formatPrice(item.amount, currency, locale))
)), calculations.taxes > 0 && calculations.getItemsByType("tax").map((item) => /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    key: item.id,
    initial: animated ? { opacity: 0, x: -10 } : false,
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: ANIMATION_DELAYS.tax },
    className: "flex justify-between items-center text-blue-600"
  },
  /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React9.createElement("span", { className: "text-sm" }, item.label)),
  /* @__PURE__ */ React9.createElement("span", { className: "font-medium" }, formatPrice(item.amount, currency, locale))
)), calculations.fees > 0 && calculations.getItemsByType("fee").map((item) => /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    key: item.id,
    initial: animated ? { opacity: 0, x: -10 } : false,
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: ANIMATION_DELAYS.fee },
    className: "flex justify-between items-center text-orange-600"
  },
  /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React9.createElement("span", { className: "text-sm" }, item.label)),
  /* @__PURE__ */ React9.createElement("span", { className: "font-medium" }, formatPrice(item.amount, currency, locale))
)), calculations.extras > 0 && calculations.getItemsByType("extra").map((item) => /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    key: item.id,
    initial: animated ? { opacity: 0, x: -10 } : false,
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: ANIMATION_DELAYS.extra },
    className: "flex justify-between items-center text-purple-600"
  },
  /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, getItemIcon(item.type), /* @__PURE__ */ React9.createElement("span", { className: "text-sm" }, item.label)),
  /* @__PURE__ */ React9.createElement("span", { className: "font-medium" }, formatPrice(item.amount, currency, locale))
)), /* @__PURE__ */ React9.createElement(
  motion3.div,
  {
    initial: animated ? { opacity: 0, y: 10 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: ANIMATION_DELAYS.total },
    className: cn(
      "flex justify-between items-center font-bold text-lg pt-3 border-t",
      highlightTotal && "text-primary"
    )
  },
  /* @__PURE__ */ React9.createElement("span", null, "Total"),
  /* @__PURE__ */ React9.createElement("span", null, formatPrice(calculations.total, currency, locale))
));

// src/components/business/PriceSummary/components/DetailedView.tsx
import React11 from "react";
import { Info as Info2 } from "lucide-react";

// src/components/business/PriceSummary/components/SummaryCards.tsx
import React10 from "react";
import { Receipt, Percent, Calculator, CreditCard as CreditCard2 } from "lucide-react";
var SummaryCards = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  currency,
  locale
}) => /* @__PURE__ */ React10.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3" }, /* @__PURE__ */ React10.createElement("div", { className: "bg-muted/30 rounded-lg p-3" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React10.createElement(Receipt, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React10.createElement("span", { className: "text-xs text-muted-foreground" }, "Base")), /* @__PURE__ */ React10.createElement("div", { className: "font-semibold" }, formatPrice(subtotal, currency, locale))), discounts > 0 && /* @__PURE__ */ React10.createElement("div", { className: "bg-green-50 rounded-lg p-3" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React10.createElement(Percent, { className: "h-4 w-4 text-green-600" }), /* @__PURE__ */ React10.createElement("span", { className: "text-xs text-green-600" }, "Descontos")), /* @__PURE__ */ React10.createElement("div", { className: "font-semibold text-green-600" }, "-", formatPrice(discounts, currency, locale))), taxes > 0 && /* @__PURE__ */ React10.createElement("div", { className: "bg-blue-50 rounded-lg p-3" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React10.createElement(Calculator, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ React10.createElement("span", { className: "text-xs text-blue-600" }, "Impostos")), /* @__PURE__ */ React10.createElement("div", { className: "font-semibold text-blue-600" }, formatPrice(taxes, currency, locale))), fees + extras > 0 && /* @__PURE__ */ React10.createElement("div", { className: "bg-orange-50 rounded-lg p-3" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React10.createElement(CreditCard2, { className: "h-4 w-4 text-orange-600" }), /* @__PURE__ */ React10.createElement("span", { className: "text-xs text-orange-600" }, "Taxas")), /* @__PURE__ */ React10.createElement("div", { className: "font-semibold text-orange-600" }, formatPrice(fees + extras, currency, locale))));

// src/components/business/PriceSummary/components/DetailedView.tsx
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
}) => /* @__PURE__ */ React11.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React11.createElement(
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
), /* @__PURE__ */ React11.createElement("div", { className: "border rounded-lg p-4 space-y-3" }, /* @__PURE__ */ React11.createElement("h4", { className: "font-medium flex items-center gap-2" }, /* @__PURE__ */ React11.createElement(Info2, { className: "h-4 w-4" }), "Detalhamento"), items.map((item) => /* @__PURE__ */ React11.createElement(
  PriceItemRow,
  {
    key: item.id,
    item,
    currency,
    locale,
    onHover: onItemHover,
    showHoverIcon: true,
    isHovered: hoveredItem === item.id
  }
)), /* @__PURE__ */ React11.createElement("div", { className: cn(
  "flex justify-between items-center font-bold text-lg pt-3 border-t-2",
  highlightTotal && "text-primary"
) }, /* @__PURE__ */ React11.createElement("span", null, "Total"), /* @__PURE__ */ React11.createElement("span", null, formatPrice(calculations.total, currency, locale)))), showCalculation && /* @__PURE__ */ React11.createElement(
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
));

// src/components/business/PriceSummary/components/CalculationBreakdown.tsx
import React12 from "react";
import { Calculator as Calculator2 } from "lucide-react";
var CalculationBreakdown = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  total,
  currency,
  locale
}) => /* @__PURE__ */ React12.createElement("div", { className: "mt-4 p-3 bg-muted/30 rounded-lg" }, /* @__PURE__ */ React12.createElement("h4", { className: "font-medium mb-2 flex items-center gap-2" }, /* @__PURE__ */ React12.createElement(Calculator2, { className: "h-4 w-4" }), "C\xE1lculo"), /* @__PURE__ */ React12.createElement("div", { className: "text-xs space-y-1 font-mono" }, /* @__PURE__ */ React12.createElement("div", null, "Base: ", formatPrice(subtotal, currency, locale)), discounts > 0 && /* @__PURE__ */ React12.createElement("div", { className: "text-green-600" }, "- Descontos: ", formatPrice(discounts, currency, locale)), taxes > 0 && /* @__PURE__ */ React12.createElement("div", { className: "text-blue-600" }, "+ Impostos: ", formatPrice(taxes, currency, locale)), fees > 0 && /* @__PURE__ */ React12.createElement("div", { className: "text-orange-600" }, "+ Taxas: ", formatPrice(fees, currency, locale)), extras > 0 && /* @__PURE__ */ React12.createElement("div", { className: "text-purple-600" }, "+ Extras: ", formatPrice(extras, currency, locale)), /* @__PURE__ */ React12.createElement("div", { className: "font-bold pt-1 border-t" }, "= Total: ", formatPrice(total, currency, locale))));

// src/components/business/PriceSummary/PriceSummary.tsx
var PriceSummary = ({
  items,
  currency = "BRL",
  locale = "pt-BR",
  variant = "default",
  showCalculation = true,
  showTaxes = true,
  showDiscounts = true,
  className,
  onItemHover,
  animated = true,
  highlightTotal = true
}) => {
  const [hoveredItem, setHoveredItem] = React13.useState(null);
  const calculations = usePriceCalculations(items, showDiscounts, showTaxes);
  const handleItemHover = React13.useCallback((item) => {
    setHoveredItem(item?.id ?? null);
    onItemHover?.(item);
  }, [onItemHover]);
  const renderContent = () => {
    const { subtotal, discounts, taxes, fees, extras, total } = calculations;
    switch (variant) {
      case "minimal":
        return /* @__PURE__ */ React13.createElement(
          MinimalView,
          {
            total,
            currency,
            locale,
            highlightTotal
          }
        );
      case "compact":
        return /* @__PURE__ */ React13.createElement(
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
        return /* @__PURE__ */ React13.createElement(
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
        return /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement(
          DefaultView,
          {
            calculations,
            currency,
            locale,
            highlightTotal,
            animated
          }
        ), showCalculation && /* @__PURE__ */ React13.createElement(
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
        ));
    }
  };
  return /* @__PURE__ */ React13.createElement(
    motion4.div,
    {
      initial: animated ? { opacity: 0, y: 20 } : false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: animated ? 0.5 : 0 },
      className: cn("bg-card rounded-lg border p-4", className)
    },
    renderContent()
  );
};

// src/components/BlogCard.tsx
import { motion as motion5 } from "framer-motion";
import { Calendar as Calendar2, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
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
  return /* @__PURE__ */ React.createElement(
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
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative aspect-[16/10] overflow-hidden" }, /* @__PURE__ */ React.createElement(
      motion5.img,
      {
        whileHover: { scale: 1.1 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        src: image,
        alt: `Artigo: ${title}`,
        className: "h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all",
        loading: "lazy"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute left-4 top-4 z-10" }, /* @__PURE__ */ React.createElement("span", { className: "rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md border border-indigo-500/30" }, category)), /* @__PURE__ */ React.createElement("div", { className: "absolute right-4 top-4 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-full bg-white p-2 text-slate-950 shadow-lg" }, /* @__PURE__ */ React.createElement(ArrowUpRight, { className: "h-4 w-4" })))),
    /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-1 flex-col p-6" }, /* @__PURE__ */ React.createElement("div", { className: "mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500" }, /* @__PURE__ */ React.createElement(Calendar2, { className: "h-3.5 w-3.5 text-indigo-500" }), /* @__PURE__ */ React.createElement("time", { dateTime: date }, date)), /* @__PURE__ */ React.createElement("h4", { className: "mb-3 text-xl font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2" }, title), /* @__PURE__ */ React.createElement("p", { className: "mb-6 line-clamp-3 text-sm leading-relaxed text-slate-400" }, excerpt), /* @__PURE__ */ React.createElement("div", { className: "mt-auto flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }, "Ler Artigo Completo", /* @__PURE__ */ React.createElement("div", { className: "h-px w-8 bg-indigo-500" }))),
    /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" })
  );
};
var BlogCard_default = BlogCard;

export {
  FAQSection,
  BookingDialog,
  PriceSummary,
  BlogCard_default
};
//# sourceMappingURL=chunk-WQXMXCBG.js.map