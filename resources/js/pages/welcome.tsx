import { PaginationResponse } from '@/types/paginationResponse';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Mail,
    MapPin,
    Phone,
    Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type LabelValue = string | number | null | undefined;
type LabelObject = Record<string, LabelValue>;

type JobPosition = {
    job_position_id: number | string;
    job_position_title: string;
    job_description?: string | null;
    status_engagement?: string | LabelObject | null;
    status_engagement_id?: number | string | null;
    job_position_code?: string | null;
    division?: string | LabelObject | null;
    section?: string | LabelObject | null;
    salary?: string | number | null;
    salaryGrade?: string | null;
    salary_grade?: string | LabelObject | null;
    salary_grade_id?: number | string | null;
    deadline_submission?: string | Date | null;
    job_post_expiry?: string | Date | null;
    job_position_slug?: string | null;
    is_open?: boolean | number | null;
};

type JobPositionsResponse = {
    data: PaginationResponse<JobPosition>;
    success: boolean;
    message: string;
};

const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

const getLabel = (value: string | LabelObject | null | undefined, keys: string[], fallback = 'Not specified') => {
    if (typeof value === 'string' && value.trim()) {
        return value;
    }

    if (value && typeof value === 'object') {
        for (const key of keys) {
            const nestedValue = value[key];

            if (nestedValue !== null && nestedValue !== undefined && String(nestedValue).trim()) {
                return String(nestedValue);
            }
        }
    }

    return fallback;
};

const formatDate = (date: string | Date | null | undefined) => {
    if (!date) {
        return 'Not specified';
    }

    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

const getJobOffice = (job: JobPosition) => {
    const division = getLabel(job.division, ['division_name', 'name'], '');
    const section = getLabel(job.section, ['section_name', 'name'], '');

    return [division, section].filter(Boolean).join(' / ') || 'DOST-STII';
};

const getJobType = (job: JobPosition) => getLabel(job.status_engagement, ['status_engagement_name', 'name', 'title'], 'Not specified');

const getSalaryGrade = (job: JobPosition) =>
    job.salaryGrade || getLabel(job.salary_grade, ['salary_grade', 'salary_grade_name', 'name'], 'Not specified');

const getDeadline = (job: JobPosition) => formatDate(job.deadline_submission ?? job.job_post_expiry);

const getApplyHref = (job: JobPosition) => `/vacancies/${job.job_position_slug || job.job_position_id}/apply`;

const getPageNumbers = (currentPage: number, lastPage: number) => {
    const pages = new Set([1, lastPage, currentPage - 1, currentPage, currentPage + 1]);

    return [...pages].filter((page) => page >= 1 && page <= lastPage).sort((a, b) => a - b);
};

export default function Welcome() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<PaginationResponse<JobPosition>>();
    const [latestVacancy, setLatestVacancy] = useState<JobPosition>();

    const jobPositions = useMemo(() => data?.data ?? [], [data]);
    const currentPage = data?.current_page ?? 1;
    const lastPage = data?.last_page ?? 1;
    const pageNumbers = useMemo(() => getPageNumbers(currentPage, lastPage), [currentPage, lastPage]);

    const loadJobPositions = async (page = 1) => {
        setLoading(true);

        try {
            const res = await axios.get<JobPositionsResponse>('/get-job-positions', {
                params: { page },
            });

            setData(res.data.data);

            if (page === 1) {
                setLatestVacancy(res.data.data.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch job positions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage || loading) {
            return;
        }

        loadJobPositions(page);
        document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        loadJobPositions();
    }, []);

    return (
        <>
            <Head title="DOST-STII Hiring Portal">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
                <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
                    <img
                        src="/img/dost-with-flag.png"
                        alt=""
                        className="absolute inset-y-0 right-0 -z-20 hidden h-full w-[52%] object-cover object-center xl:block"
                    />
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_50%,rgba(255,255,255,0.9)_68%,rgba(255,255,255,0.18)_100%)]" />

                    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
                                <img src="/img/dost-bottom-right-bg-image.png" alt="DOST-STII mark" className="h-8 w-8 object-contain" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold tracking-[0.18em] text-[#0067b1] uppercase">DOST-STII</p>
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    Science and Technology Information Institute Hiring Portal
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 rounded-md bg-[#005baa] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004b8c] focus:ring-2 focus:ring-[#005baa] focus:ring-offset-2 focus:outline-none"
                        >
                            View vacancies
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </header>

                    <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pt-10 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-16 lg:pb-20">
                        <div className="max-w-3xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#b9def6] bg-[#eef8ff] px-3 py-2 text-sm font-semibold text-[#005baa]">
                                <BriefcaseBusiness className="h-4 w-4" />
                                Public vacancy board
                            </div>

                            <h1 className="max-w-4xl text-4xl leading-[1.06] font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                Find your next public service role at DOST-STII.
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                Browse current vacancies and select Apply for the position that matches your background. Application details will be
                                collected on a separate page.
                            </p>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#005baa] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004b8c] focus:ring-2 focus:ring-[#005baa] focus:ring-offset-2 focus:outline-none"
                                >
                                    Browse vacancies
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
                                <div className="px-4 py-4">
                                    <p className="text-2xl font-bold text-slate-950">{loading ? '...' : (data?.total ?? 0)}</p>
                                    <p className="mt-1 text-xs font-medium tracking-wide text-slate-500 uppercase">Open vacancies</p>
                                </div>
                                <div className="px-4 py-4">
                                    <p className="text-2xl font-bold text-slate-950">Public</p>
                                    <p className="mt-1 text-xs font-medium tracking-wide text-slate-500 uppercase">Vacancy list</p>
                                </div>
                                <div className="px-4 py-4">
                                    <p className="text-2xl font-bold text-slate-950">DOST-STII</p>
                                    <p className="mt-1 text-xs font-medium tracking-wide text-slate-500 uppercase">Hiring office</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="overflow-hidden rounded-lg border border-white/60 bg-slate-900 shadow-2xl xl:hidden">
                                <img
                                    src="/img/dost-with-flag.png"
                                    alt="DOST-STII office building with Philippine flag"
                                    className="h-64 w-full object-cover sm:h-80"
                                />
                            </div>

                            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-xl xl:mt-24 xl:max-w-md">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-500">Latest vacancy</p>
                                        {loading ? (
                                            <div className="mt-2 h-7 w-4/5 animate-pulse rounded bg-slate-200" />
                                        ) : (
                                            <h2 className="mt-1 text-xl font-bold text-slate-950">
                                                {latestVacancy?.job_position_title ?? 'No vacancy available'}
                                            </h2>
                                        )}
                                    </div>
                                    <div className="rounded-md bg-[#eaf6ff] p-2 text-[#005baa]">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="mt-5 space-y-3">
                                        <div className="h-16 animate-pulse rounded-md bg-slate-100" />
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="h-16 animate-pulse rounded-md bg-slate-100" />
                                            <div className="h-16 animate-pulse rounded-md bg-slate-100" />
                                        </div>
                                        <div className="h-12 animate-pulse rounded-md bg-slate-100" />
                                        <div className="h-11 animate-pulse rounded-md bg-slate-200" />
                                    </div>
                                ) : latestVacancy ? (
                                    <div className="mt-5 space-y-3">
                                        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
                                            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Office</p>
                                            <p className="mt-1 text-sm font-medium text-slate-800">{getJobOffice(latestVacancy)}</p>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
                                                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Type</p>
                                                <p className="mt-1 text-sm font-medium text-slate-800">{getJobType(latestVacancy)}</p>
                                            </div>
                                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
                                                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Grade</p>
                                                <p className="mt-1 text-sm font-medium text-slate-800">{getSalaryGrade(latestVacancy)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-[#005baa]" />
                                            <span className="text-sm font-medium text-slate-700">Apply until {getDeadline(latestVacancy)}</span>
                                        </div>
                                        <a
                                            href={getApplyHref(latestVacancy)}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#005baa] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004b8c] focus:ring-2 focus:ring-[#005baa] focus:ring-offset-2 focus:outline-none"
                                        >
                                            Apply to latest vacancy
                                            <ArrowRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                                        No open vacancy is available at the moment.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="vacancies" className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-[0.18em] text-[#005baa] uppercase">Current openings</p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Vacancy list</h2>
                        </div>
                        <p className="max-w-xl text-sm leading-6 text-slate-600">
                            Select Apply to proceed to the dedicated application page for that vacancy.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Position
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Office
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Type
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Location
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Closing date
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Status
                                        </th>
                                        <th scope="col" className="px-5 py-4 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {loading ? (
                                        skeletonRows.map((row) => (
                                            <tr key={row}>
                                                {Array.from({ length: 7 }, (_, cell) => (
                                                    <td key={cell} className="px-5 py-4">
                                                        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : jobPositions.length > 0 ? (
                                        jobPositions.map((job) => (
                                            <tr key={job.job_position_id} className="hover:bg-slate-50">
                                                <td className="px-5 py-4 align-top">
                                                    <p className="font-semibold text-slate-950">{job.job_position_title}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{getSalaryGrade(job)}</p>
                                                </td>
                                                <td className="px-5 py-4 align-top text-sm text-slate-700">{getJobOffice(job)}</td>
                                                <td className="px-5 py-4 align-top text-sm text-slate-700">{getJobType(job)}</td>
                                                <td className="px-5 py-4 align-top text-sm text-slate-700">DOST-STII, Bicutan, Taguig City</td>
                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                                        <CalendarDays className="h-4 w-4 text-[#005baa]" />
                                                        {getDeadline(job)}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        {job.is_open === false || job.is_open === 0 ? 'Closed' : 'Open'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right align-top">
                                                    <a
                                                        href={getApplyHref(job)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#005baa] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004b8c] focus:ring-2 focus:ring-[#005baa] focus:ring-offset-2 focus:outline-none"
                                                    >
                                                        Apply
                                                        <ArrowRight className="h-4 w-4" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                                                No vacancies are currently posted.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-600">
                                {loading
                                    ? 'Loading vacancies...'
                                    : data && data.total > 0
                                      ? `Showing ${data.from} to ${data.to} of ${data.total} vacancies`
                                      : 'No vacancies to display'}
                            </p>

                            {lastPage > 1 && (
                                <nav className="flex items-center gap-2" aria-label="Vacancy pagination">
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={loading || currentPage === 1}
                                        className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>

                                    <div className="hidden items-center gap-1 sm:flex">
                                        {pageNumbers.map((page, index) => {
                                            const previousPage = pageNumbers[index - 1];
                                            const hasGap = previousPage !== undefined && page - previousPage > 1;

                                            return (
                                                <div key={page} className="flex items-center gap-1">
                                                    {hasGap && <span className="px-2 text-sm text-slate-400">...</span>}
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(page)}
                                                        disabled={loading || page === currentPage}
                                                        className={
                                                            page === currentPage
                                                                ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-[#005baa] px-3 text-sm font-semibold text-white'
                                                                : 'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45'
                                                        }
                                                    >
                                                        {page}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <span className="text-sm font-semibold text-slate-600 sm:hidden">
                                        Page {currentPage} of {lastPage}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={loading || currentPage === lastPage}
                                        className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </nav>
                            )}
                        </div>
                    </div>
                </section>

                <footer className="border-t border-slate-800 bg-slate-950 text-white">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white">
                                    <img src="/img/dost-bottom-right-bg-image.png" alt="DOST-STII mark" className="h-8 w-8 object-contain" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-[0.18em] uppercase">DOST-STII</p>
                                    <p className="mt-1 text-sm text-slate-300">Science and Technology Information Institute</p>
                                </div>
                            </div>
                            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
                                Public vacancy board for DOST-STII recruitment. Applicants may review current openings and proceed to the proper
                                application page for each position.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-bold tracking-wide uppercase">Quick Links</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-300">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="block transition hover:text-white"
                                >
                                    Current vacancies
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="block transition hover:text-white"
                                >
                                    Back to top
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold tracking-wide uppercase">HR Contact</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-300">
                                <div className="flex gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#7cc7ff]" />
                                    <span>hr@stii.dost.gov.ph</span>
                                </div>
                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#7cc7ff]" />
                                    <span>(02) 8837-2071 local HR</span>
                                </div>
                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7cc7ff]" />
                                    <span>DOST Compound, Bicutan, Taguig City</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800">
                        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                            <p>Copyright {new Date().getFullYear()} DOST-STII. All rights reserved.</p>
                            <p>Government recruitment information system</p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
