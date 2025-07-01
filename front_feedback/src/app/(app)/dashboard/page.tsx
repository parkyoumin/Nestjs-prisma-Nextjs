import { getProjects } from "@/services/project.server";
import { Project } from "@/types/project";
import ProjectCreator from "@/components/ProjectCreator";
import ProjectCard from "@/components/ProjectCard";

export default async function DashboardPage() {
  const projects = await getProjects();
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <ProjectCreator />
      </div>

      <div className="space-y-6">
        {projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
