import {
  FolderOpen,
  Clock,
  Warning,
  CheckCircle,
  Coffee,
  FileSearch,
  Person,
  Smiley,
  SmileyMeh,
  SmileySad,
  CalendarCheck,
  Folder,
  House,
  Calendar,
  Icon,
  Files,
  IdentificationBadge,
  UsersThree,
  Archive,
} from "phosphor-react";

export type SubItensType = {
  title: string;
  path: string;
  props: { status: number } | null;
  icon: Icon | null;
};
export type SubSideBarMenuType = {
  title: string;
  path: string
  subItens: SubItensType[] | null;
};
export type SideBarMenuItemType = {
  title: string;
  path: string;
  icon: Icon;
  props: { status: number };
  subSideBarMenu: SubSideBarMenuType[] | null;
  spaceInBottom: boolean;
};
export type SideBarMenuType = SideBarMenuItemType[];

export const SideBarMenu = [
  {
    title: "Dashboard",
    path: "/",
    props: { status: 0 },
    icon: House,
    subSideBarMenu: null,
    spaceInBottom: true,
  },
  {
    title: "Casos",
    icon: Archive,
    path: "/casos",
    props: { status: 0 },
    spaceInBottom: false,
    subSideBarMenu: [
      {
        title: "Casos",
        path: "/casos",
        subItens: [
          {
            title: "Abertos",
            path: "/casos",
            props: { status: 1 },
            icon: FolderOpen,
          },
          {
            title: "Aguardando",
            path: "/casos",
            props: { status: 2 },
            icon: Clock,
          },
          {
            title: "Expirados",
            path: "/casos",
            props: { status: 3 },
            icon: Warning,
          },
          {
            title: "Finalizados",
            path: "/casos",
            props: { status: 4 },
            icon: CheckCircle,
          },
          {
            title: "Mostrar todos",
            path: "/casos",
            props: null,
            icon: null,
          },
        ],
      },
      {
        title: "Relatórios",
        path: "/relatorios",
        subItens: [
          {
            title: "Em espera",
            path: "/relatorios",
            props: { status: 1 },
            icon: FolderOpen,
          },
          {
            title: "Em analise",
            path: "/relatorios",
            props: { status: 2 },
            icon: Coffee,
          },
          {
            title: "Em revisão",
            path: "/relatorios",
            props: { status: 3 },
            icon: FileSearch,
          },
          {
            title: "Revisados",
            path: "/relatorios",
            props: { status: 4 },
            icon: CheckCircle,
          },
          {
            title: "Mostrar todos",
            path: "/relatorios",
            props: null,
            icon: null,
          },
        ],
      },
      {
        title: "Solicitações",
        path: "/solicitacoes",
        subItens: [
          {
            title: "Todos",
            path: "/solicitacoes",
            icon: FolderOpen,
          },
        ],
      },
    ],
  },

  {
    title: "Relatórios",
    path: "/relatorios",
    props: { status: 0 },
    icon: Files,
    subSideBarMenu: null,
    spaceInBottom: false,
  },

  {
    title: "Solicitações",
    path: "/solicitacoes",
    props: { status: 0 },
    icon: IdentificationBadge,
    subSideBarMenu: null,
    spaceInBottom: true,
  },
  
  {
    title: "Analistas",
    icon: UsersThree,
    path: "/analistas",
    props: { status: 9 },
    spaceInBottom: false,
    subSideBarMenu: [
      {
        title: "Analistas",
        path: "/analistas",
        subItens: [
          {
            title: "Disponíveis",
            path: "/analistas",
            props: { status: 0 },
            icon: Smiley,
          },
          {
            title: "Afastado",
            path: "/analistas",
            props: { status: 1 },
            icon: SmileySad,
          },
          {
            title: "Em tarefa",
            path: "/analistas",
            props: { status: 2 },
            icon: SmileyMeh,
          },
          {
            title: "Mostrar todos",
            path: "/analistas",
            props: { status: 9 },
            icon: null,
          },
        ],
      },
      {
        title: "Afastamentos",
        path: "/afastamentos",
        subItens: [
          {
            title: "Sem validação",
            path: "/afastamentos",
            props: { status: 1 },
            icon: Clock,
          },
          {
            title: "Agendados",
            path: "/afastamentos",
            props: { status: 2 },
            icon: CalendarCheck,
          },
          {
            title: "Em andamento",
            path: "/afastamentos",
            props: { status: 3 },
            icon: Coffee,
          },
          {
            title: "Motrar todos",
            path: "/afastamentos",
            props: null,
            icon: null,
          },
        ],
      },
    ],
  },
  {
    title: "Calendário",
    path: "/calendario-afastamentos",
    props: { status: 0 },
    icon: Calendar,
    subSideBarMenu: null,
    spaceInBottom: true,
  },
] as SideBarMenuType;
