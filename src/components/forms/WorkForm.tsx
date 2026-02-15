import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { experienceSchema, experienceSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, showErrorTost, showSuccessToast } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { RichTextEditor } from "../rich-text-editor";
import { TagInput } from "../tag-input";
import { Switch } from "../ui/switch";
import { IconCalendar } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { experience } from "@/lib/types";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import APIRequest from "@/lib/BackendReq";

const employmentTypes = [
    "FULL_TIME",
    "INTERNSHIP",
    "FREELANCE",
    "CONTRACT",
    "PART_TIME",
] as const;

const typeLabels: Record<string, string> = {
    FULL_TIME: "Full Time",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    CONTRACT: "Contract",
    PART_TIME: "Part Time",
};
export default function WorkForm({ experience }: { experience?: experience }) {
    const [isCurrent, setIsCurrent] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<experienceSchemaType>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            company: experience?.company || "",
            position: experience?.position || "",
            url: experience?.url || "",
            skills: experience?.skills || [],
            description: experience?.description || "",
            type: experience?.type || "FULL_TIME",
            isCurrent: experience?.isCurrent || false,
            startDate: experience?.startDate || new Date(),
            endDate: experience?.endDate || null,
        },
    });
    // const isCurrent = watch("isCurrent");

    function onSubmit(data: experienceSchemaType) {
        startTransition(async () => {
            console.log(data)
            try {
                const formData = new FormData();
                formData.append("company", data.company);
                formData.append("position", data.position);
                if (data.url) formData.append("url", data.url);
                formData.append("type", data.type);
                formData.append("startDate", data.startDate.toISOString());
                if (data.endDate)
                    formData.append("endDate", data.endDate.toISOString());
                formData.append("isCurrent", data.isCurrent.toString());
                formData.append("description", data.description);
                formData.append("skills", JSON.stringify(data.skills));
                const response = await APIRequest.post(
                    experience ? `/api/work/${experience.id}` :
                    "api/work",
                    formData,
                );
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push("/admin/experience");
                } else {
                    showErrorTost(response.data.message);
                }
            } catch (error) {
                console.log(error);
                showErrorTost(error);
            }
        });
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">Experience</CardTitle>
                <CardDescription>Add a work experience entry.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Work Details</FieldLegend>
                        <FieldGroup>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.company}>
                                    <FieldLabel htmlFor="exp-company">
                                        Company *
                                    </FieldLabel>
                                    <Input
                                        id="exp-company"
                                        placeholder="Acme Corp"
                                        aria-invalid={!!errors.company}
                                        {...register("company")}
                                    />
                                    {errors.company && (
                                        <FieldError>
                                            {errors.company.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.position}>
                                    <FieldLabel htmlFor="exp-position">
                                        Position *
                                    </FieldLabel>
                                    <Input
                                        id="exp-position"
                                        placeholder="Senior Developer"
                                        aria-invalid={!!errors.position}
                                        {...register("position")}
                                    />
                                    {errors.position && (
                                        <FieldError>
                                            {errors.position.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.type}>
                                    <FieldLabel>Employment Type *</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="type"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger
                                                    aria-invalid={!!errors.type}
                                                >
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employmentTypes.map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {
                                                                    typeLabels[
                                                                        type
                                                                    ]
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.type && (
                                        <FieldError>
                                            {errors.type.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="exp-url">
                                        Company URL
                                    </FieldLabel>
                                    <Input
                                        id="exp-url"
                                        placeholder="https://acme.com"
                                        {...register("url")}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.startDate}>
                                    <FieldLabel>Start Date *</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(
                                                                  field.value,
                                                                  "PPP",
                                                              )
                                                            : "Pick a date"}
                                                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.startDate && (
                                        <FieldError>
                                            {errors.startDate.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.endDate}>
                                    <FieldLabel>End Date</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        disabled={isCurrent}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(
                                                                  field.value,
                                                                  "PPP",
                                                              )
                                                            : isCurrent
                                                              ? "Present"
                                                              : "Pick a date"}
                                                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value ??
                                                            undefined
                                                        }
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.endDate && (
                                        <FieldError>
                                            {errors.endDate.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field
                                orientation="horizontal"
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <FieldContent>
                                    <FieldLabel className="text-base">
                                        Currently Working Here
                                    </FieldLabel>
                                    <FieldDescription>
                                        Toggle if this is your current position.
                                    </FieldDescription>
                                </FieldContent>
                                <Switch
                                    checked={isCurrent}
                                    onCheckedChange={(checked) => {
                                        setIsCurrent(checked);
                                        setValue("isCurrent", checked);
                                        if (checked) {
                                            setValue("endDate", null);
                                        }
                                    }}
                                />
                            </Field>

                            <Field data-invalid={!!errors.skills}>
                                <FieldLabel>Skills *</FieldLabel>
                                <TagInput
                                    value={watch("skills")}
                                    onChange={(val) => setValue("skills", val)}
                                    placeholder="Add skills used (press Enter)..."
                                />
                                <FieldDescription>
                                    Press Enter to add each skill.
                                </FieldDescription>
                                {errors.skills && (
                                    <FieldError>
                                        {errors.skills.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field data-invalid={!!errors.description}>
                                <FieldLabel>Description *</FieldLabel>
                                <RichTextEditor
                                    value={watch("description")}
                                    onChange={(val) =>
                                        setValue("description", val)
                                    }
                                    placeholder="Describe your responsibilities and achievements..."
                                />
                                {errors.description && (
                                    <FieldError>
                                        {errors.description.message}
                                    </FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                        >
                            Reset
                        </Button>
                        <LoadingButton loading={isPending} type="submit">
                            Save Experience
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
