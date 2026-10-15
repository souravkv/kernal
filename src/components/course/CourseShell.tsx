import { CourseDetail } from "@/lib/courses";
import { UserProgress } from "@/lib/progress";
import CourseSidebar from "./CourseSidebar";

/**
 * Shared two-column shell for every learning page (module, topic, quiz):
 * fixed/sticky course sidebar on the left, content on the right — so you can
 * jump between chapters without going back to the overview.
 */
export default function CourseShell({
  course,
  currentModuleSlug,
  currentTopicSlug,
  progress,
  children,
}: {
  course: CourseDetail;
  currentModuleSlug: string;
  currentTopicSlug?: string;
  progress?: UserProgress | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-6 py-20 sm:px-10 sm:py-24 lg:gap-16">
      <CourseSidebar
        course={course}
        currentModuleSlug={currentModuleSlug}
        currentTopicSlug={currentTopicSlug}
        progress={progress}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
