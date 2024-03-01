--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-1.pgdg22.04+1)

-- Started on 2022-09-09 00:10:05 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 19 (class 2615 OID 19493)
-- Name: nrx; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA nrx;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 281 (class 1259 OID 19494)
-- Name: athletes; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx.athletes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text,
    "lastName" text,
    dob timestamp with time zone,
    nationality text,
    gender text,
    stance text,
    hometown text,
    "yearStatus" integer,
    "yearPoints" integer,
    "yearRank" integer,
    "playerStatus" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "providerEntryId" text,
    "startNumber" text
);


--
-- TOC entry 293 (class 1259 OID 19742)
-- Name: eventOddDerivatives; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."eventOddDerivatives" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "oddDerivativeId" uuid NOT NULL,
    "holdingPercentage" numeric,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 286 (class 1259 OID 19569)
-- Name: eventParticipants; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."eventParticipants" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "athleteId" uuid NOT NULL,
    "seedNo" integer,
    "baseProjection" numeric DEFAULT 0 NOT NULL,
    "baseLapTime" numeric,
    "baseJokerLapTime" numeric,
    "baseNonJokerLapTime" numeric,
    notes text,
    status integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 287 (class 1259 OID 19594)
-- Name: eventRounds; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."eventRounds" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "roundId" uuid NOT NULL,
    "roundStatus" integer,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 285 (class 1259 OID 19551)
-- Name: events; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx.events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "tourYearId" uuid NOT NULL,
    name text NOT NULL,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    "eventNumber" integer,
    "eventStatus" integer NOT NULL,
    "eventLocation" text,
    "eventLocationGroup" text,
    "isEventWinnerMarketOpen" boolean DEFAULT true,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "providerRunId" text,
    "categoryName" text
);


--
-- TOC entry 292 (class 1259 OID 19730)
-- Name: oddDerivatives; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."oddDerivatives" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    type integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 296 (class 1259 OID 28422)
-- Name: playerHeadToHeads; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."playerHeadToHeads" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "eventParticipant1Id" uuid NOT NULL,
    "eventParticipant2Id" uuid NOT NULL,
    "eventParticipantWinnerId" uuid,
    "player1Position" integer,
    "player2Position" integer,
    "player1Odds" numeric,
    "player2Odds" numeric,
    "player1Probability" numeric DEFAULT 0,
    "player2Probability" numeric DEFAULT 0,
    "player1TrueProbability" numeric DEFAULT 0,
    "player2TrueProbability" numeric DEFAULT 0,
    "player1HasModifiedProbability" boolean DEFAULT false,
    "player2HasModifiedProbability" boolean DEFAULT false,
    "holdingPercentage" numeric,
    voided boolean DEFAULT false,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 291 (class 1259 OID 19697)
-- Name: projectionEventHeatOutcome; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."projectionEventHeatOutcome" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "eventParticipantId" uuid NOT NULL,
    "roundHeatId" uuid NOT NULL,
    "position" integer NOT NULL,
    odds numeric NOT NULL,
    "trueProbability" numeric DEFAULT 0,
    "hasModifiedProbability" boolean DEFAULT false,
    probability numeric DEFAULT 0,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 290 (class 1259 OID 19670)
-- Name: projectionEventOutcome; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."projectionEventOutcome" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "eventParticipantId" uuid NOT NULL,
    "position" integer NOT NULL,
    odds numeric NOT NULL,
    "trueProbability" numeric DEFAULT 0,
    "hasModifiedProbability" boolean DEFAULT false,
    probability numeric DEFAULT 0,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 294 (class 1259 OID 19764)
-- Name: propBets; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."propBets" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "eventParticipantId" uuid,
    proposition text NOT NULL,
    odds numeric NOT NULL,
    voided boolean DEFAULT false NOT NULL,
    payout boolean DEFAULT false,
    probability numeric DEFAULT 0,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 288 (class 1259 OID 19616)
-- Name: roundHeats; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."roundHeats" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "roundId" uuid NOT NULL,
    "heatName" text NOT NULL,
    "heatNo" integer NOT NULL,
    "heatStatus" integer NOT NULL,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    "isHeatWinnerMarketOpen" boolean DEFAULT true,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "isHeatWinnerMarketVoided" boolean DEFAULT false NOT NULL,
    "providerRunId" text
);


--
-- TOC entry 282 (class 1259 OID 19506)
-- Name: rounds; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx.rounds (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    "roundNo" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 289 (class 1259 OID 19641)
-- Name: scores; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx.scores (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "eventId" uuid NOT NULL,
    "roundHeatId" uuid NOT NULL,
    "athleteId" uuid NOT NULL,
    "roundSeed" integer,
    "lapTime" numeric,
    "jokerLapTime" numeric,
    "heatPosition" integer,
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "lapNumber" integer,
    "isJoker" boolean DEFAULT false NOT NULL,
    "isBye" boolean DEFAULT false NOT NULL,
    status text
);


--
-- TOC entry 284 (class 1259 OID 19535)
-- Name: tourYears; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx."tourYears" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "tourId" uuid NOT NULL,
    year integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 283 (class 1259 OID 19518)
-- Name: tours; Type: TABLE; Schema: nrx; Owner: -
--

CREATE TABLE nrx.tours (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    gender text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 3195 (class 0 OID 19494)
-- Dependencies: 281
-- Data for Name: athletes; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx.athletes (id, "firstName", "middleName", "lastName", dob, nationality, gender, stance, hometown, "yearStatus", "yearPoints", "yearRank", "playerStatus", "isActive", "isArchived", "createdAt", "updatedAt", "providerEntryId", "startNumber") FROM stdin;
c98215ca-b233-49f6-a9f3-3dd0e34c1011	Scott		Speed	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
95d3b712-09f7-4750-88ae-376680c67a8a	Timmy		Hansen	\N	SE	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
93ca2b38-7487-4e9a-b57a-98cf962050b9	Kevin		Hansen	\N	SE	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
aa538b11-123d-4ce6-a85f-1954d88dca71	Steve		Arpin	\N	CA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
34154703-e8e1-4857-b50c-5ca928631056	Tanner		Foust	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
7c1753ff-f867-44df-8052-6e634163a215	Fraser		McConnell	\N	JM	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
a72fd561-0a12-47ba-8d4b-35bfade8497c	Kevin		Eriksson	\N	SE	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
b6288334-84e9-4346-9540-9db9d25ebf18	Cabot		Bigham	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
3555ad6e-4378-4820-b377-30e28434a65f	Ronalds		Baldins	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
4db9c2e5-9eda-40b7-8250-71ecfa73b13a	Chase		Elliott	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
b9e90030-eec1-4140-b55d-cb558b60ca6c	Liam		Doran	\N	UK	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	Andrew		Carlson	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
50c728b4-196e-4a63-8406-6031609368ed	Andreas		Bakkerud	\N	NOR	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1013	13
c4c4a20b-dc70-4806-99e2-b280f36fb4eb	Oliver		Eriksson	\N	SWE	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1016	16
7d302c30-4506-41a2-9eca-43e47ce03631	Travis		Pastrana	\N	USA	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1199	199
a4452a78-f47d-4ddd-bc45-e59b916afdf8	Conner		Martell	\N	USA	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1021	21
8bd83a59-ffa6-4a99-9d9c-d258abe64802	Johan		Kristoffersson	\N	SWE	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1003	3
7c7385f1-259e-4e9b-bed3-031a2ed5041c	Fraser		Mcconnell	\N	JAM	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1035	35
368ba3e3-7b6d-4a4d-95ab-af081466c45a	Robin		Larsson	\N	SWE	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1004	4
f9de87a9-ae4d-46be-9de6-32e59fd48cb9	Oliver		Bennett	\N	GBR	men	Regular	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1042	42
394e070d-2570-48e2-90ba-a2622a8b4925	Ole	Christian	Veiby	\N	NOR	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1052	52
42dd513a-7a48-4389-a17d-d78aadce80c3	Kris		Meeke	\N	GBR	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1062	62
e4b40121-bc71-4cb3-91ee-f27bd10af9ce	Niclas		Grönholm	\N	FIN	\N	\N	\N	1	0	0	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00	1068	68
ba60e260-fcf8-465d-9b89-42263911ba92	Kyle		Busch	\N	\N	men	\N	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	Yury		Belevskiy	\N	\N	men	\N	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
93b77fe3-4e5c-4470-a9f7-f3451fc25ece	Tristan		Ovenden	\N	\N	men	\N	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
d8737390-58e5-4dd3-9e6e-b460583c7e48	Patrick		O'Donovan	\N	\N	men	\N	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
a9f027ae-20cb-448e-a7b8-ceda34386e49	Dom		Flitney	\N	\N	men	\N	\N	1	0	0	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	\N	\N
\.


--
-- TOC entry 3207 (class 0 OID 19742)
-- Dependencies: 293
-- Data for Name: eventOddDerivatives; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."eventOddDerivatives" (id, "eventId", "oddDerivativeId", "holdingPercentage", "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3200 (class 0 OID 19569)
-- Dependencies: 286
-- Data for Name: eventParticipants; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."eventParticipants" (id, "eventId", "athleteId", "seedNo", "baseProjection", "baseLapTime", "baseJokerLapTime", "baseNonJokerLapTime", notes, status, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
bc702b93-83d0-4ff5-8136-82de5ebb7f0e	daa1e513-a5e0-4206-86bd-2fa277eab3d0	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
a0ea57d9-24ab-4faf-b4b0-6fdae6fb9ff8	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
8c0644cd-99d8-4730-8a38-a47e4d61570d	daa1e513-a5e0-4206-86bd-2fa277eab3d0	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
c2eb6514-ad71-4df8-9161-8a485859cf8f	daa1e513-a5e0-4206-86bd-2fa277eab3d0	34154703-e8e1-4857-b50c-5ca928631056	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
09de9fe2-5855-4ba3-be16-205ab99ae9e1	daa1e513-a5e0-4206-86bd-2fa277eab3d0	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
8ce4c45d-e00b-46ae-9686-7ca30db4a9c5	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
caa4b3b5-1ac6-4ca1-bcc8-95849eee0eb1	daa1e513-a5e0-4206-86bd-2fa277eab3d0	50c728b4-196e-4a63-8406-6031609368ed	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
bb668fd1-2c64-4778-bcf8-2cbbe3e01293	daa1e513-a5e0-4206-86bd-2fa277eab3d0	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b0eea04c-405e-49d6-bc90-ccdf1a5226fa	daa1e513-a5e0-4206-86bd-2fa277eab3d0	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
c0fec2a2-717f-4e53-906c-d0b9f5e9c33f	daa1e513-a5e0-4206-86bd-2fa277eab3d0	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
673e5892-9c24-4112-be5e-c9fbc4c091ba	daa1e513-a5e0-4206-86bd-2fa277eab3d0	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
34635df7-84ac-46c6-9c2b-ad1fecbba588	daa1e513-a5e0-4206-86bd-2fa277eab3d0	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b968d3c8-1885-493b-8ae5-99640cff638c	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
25a69132-2bd7-464c-bee3-d9ea66e3cb0a	daa1e513-a5e0-4206-86bd-2fa277eab3d0	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
96e28d21-068d-43ed-b8ef-9f0516bd06cb	08709cdd-7882-4e18-9b0f-70c0c1efa889	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
779760bd-25d8-4645-84eb-52ff4535c47b	08709cdd-7882-4e18-9b0f-70c0c1efa889	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b3cb3716-2107-466f-b83d-c169c57b94e4	08709cdd-7882-4e18-9b0f-70c0c1efa889	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
42449550-be57-4359-a721-80fa83f98746	08709cdd-7882-4e18-9b0f-70c0c1efa889	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
4b82d0b6-5783-400a-8254-32c6e57f6a63	08709cdd-7882-4e18-9b0f-70c0c1efa889	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
fef78bd3-9b12-4e88-a7a3-8ca57ec22fea	08709cdd-7882-4e18-9b0f-70c0c1efa889	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
3243a7bd-8373-4999-a6d3-64b0f0820593	08709cdd-7882-4e18-9b0f-70c0c1efa889	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
4ef9f0b7-40ad-4505-b07b-47cd37d993ea	08709cdd-7882-4e18-9b0f-70c0c1efa889	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
bb119ee7-70f2-4da9-83a6-8120ba983efb	08709cdd-7882-4e18-9b0f-70c0c1efa889	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
14c197e4-7d91-485a-a079-66ec5ff3d543	08709cdd-7882-4e18-9b0f-70c0c1efa889	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
6fa82920-d268-4375-b3c9-23d3a87e3f58	08709cdd-7882-4e18-9b0f-70c0c1efa889	c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
3c4ee41e-7623-4548-b577-a4e1857807ad	08709cdd-7882-4e18-9b0f-70c0c1efa889	50c728b4-196e-4a63-8406-6031609368ed	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
53121595-9ed8-4a0e-81c3-4d79128f97f0	08709cdd-7882-4e18-9b0f-70c0c1efa889	34154703-e8e1-4857-b50c-5ca928631056	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
702a700b-78cd-46af-8b7e-57ad265e9ae4	08709cdd-7882-4e18-9b0f-70c0c1efa889	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
4ceb6253-fed7-48b0-8aed-23c775d9f176	08709cdd-7882-4e18-9b0f-70c0c1efa889	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
bd270c6b-97dc-4e8e-996b-59807aaaa93c	3ecc113e-20a8-4c70-9608-b47ad56d0079	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
e1ea1cb7-3d06-4bdc-ac82-e5d27bd8b238	3ecc113e-20a8-4c70-9608-b47ad56d0079	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
1e5f7da1-e52b-46c5-a766-478d64d84142	3ecc113e-20a8-4c70-9608-b47ad56d0079	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
db8b4968-abde-464e-ba90-4acfdc5de9d7	3ecc113e-20a8-4c70-9608-b47ad56d0079	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
5a3f7a9e-fec8-4089-b9ad-b7f430fa7e3e	3ecc113e-20a8-4c70-9608-b47ad56d0079	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
a487d055-7e24-4e88-8ca3-4a6238fb8d2d	3ecc113e-20a8-4c70-9608-b47ad56d0079	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
bbbf723f-f859-4766-82e9-8d56602ce6c2	3ecc113e-20a8-4c70-9608-b47ad56d0079	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
f6d62a21-3a7c-492a-987e-c7e6442fdee5	3ecc113e-20a8-4c70-9608-b47ad56d0079	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
fb06743c-447a-477f-8c93-efbd2e0718df	3ecc113e-20a8-4c70-9608-b47ad56d0079	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
52740c82-6efd-46a0-93a8-b3ca8e9ccd86	3ecc113e-20a8-4c70-9608-b47ad56d0079	34154703-e8e1-4857-b50c-5ca928631056	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
0df432c1-f6cf-4d49-83b1-83bc3e1aa273	3ecc113e-20a8-4c70-9608-b47ad56d0079	ba60e260-fcf8-465d-9b89-42263911ba92	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b58dd4ac-27f3-4cb0-addf-50e24b41735e	3ecc113e-20a8-4c70-9608-b47ad56d0079	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
6ead06fd-6e49-40cc-ac85-689dfe3270a6	3ecc113e-20a8-4c70-9608-b47ad56d0079	3555ad6e-4378-4820-b377-30e28434a65f	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
37587d17-eca5-4aea-92ee-af4a35e0ba82	3ecc113e-20a8-4c70-9608-b47ad56d0079	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b10814b1-690e-44dd-a7ca-a625430afe57	3ecc113e-20a8-4c70-9608-b47ad56d0079	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
ee43e5b1-8a19-4f36-b8e0-ab0ab91c5c86	3cd79f71-bb2c-49de-b0f4-da603ca913b3	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
7c07d601-9483-455d-aac1-3211b6e69740	3cd79f71-bb2c-49de-b0f4-da603ca913b3	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
e7b52b15-ffce-4120-ab3a-cc23a03b94c4	3cd79f71-bb2c-49de-b0f4-da603ca913b3	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
443bc1e6-6342-4b25-95d5-0350fbdf9e32	3cd79f71-bb2c-49de-b0f4-da603ca913b3	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
e11a2b28-618e-46f6-a54e-617f0a3cfebb	3cd79f71-bb2c-49de-b0f4-da603ca913b3	50c728b4-196e-4a63-8406-6031609368ed	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
c00cf83b-4f80-40f3-bcb1-88d3027552f0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
8ea06f7a-bbe8-40ed-9a39-90506725b05d	3cd79f71-bb2c-49de-b0f4-da603ca913b3	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
7bb956bd-ff1d-494e-9e87-a41718192fe0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
0769a198-c23f-4d37-a5b0-f22e67859a92	3cd79f71-bb2c-49de-b0f4-da603ca913b3	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
d0aaca69-1b1e-48d6-9e87-a791ffd1692a	3cd79f71-bb2c-49de-b0f4-da603ca913b3	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
a15fafa3-c198-472c-bcb3-8f7f4572f783	3cd79f71-bb2c-49de-b0f4-da603ca913b3	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
67c86500-9ac5-434d-8af5-d84a545cb332	3cd79f71-bb2c-49de-b0f4-da603ca913b3	34154703-e8e1-4857-b50c-5ca928631056	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
551044d1-7201-454a-a739-c1d6350196f7	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3555ad6e-4378-4820-b377-30e28434a65f	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
90181928-f2cd-4e14-ba4c-c1854f5f1820	3cd79f71-bb2c-49de-b0f4-da603ca913b3	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
97e4e4d3-12df-4c87-9852-bcf01485e790	3cd79f71-bb2c-49de-b0f4-da603ca913b3	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
477d7ee6-ef85-4cae-96b3-ea03dafae74e	fdb36615-d7b0-4b83-8189-1cf03abbc692	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
ce8fde23-2714-4561-863c-59f58c3ac0d7	fdb36615-d7b0-4b83-8189-1cf03abbc692	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
e12dd154-f472-41ad-a62e-b503312c7a96	fdb36615-d7b0-4b83-8189-1cf03abbc692	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
7e36f08f-6076-4cfe-89f5-92e5f6d61f69	fdb36615-d7b0-4b83-8189-1cf03abbc692	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
e9ac1f1e-5a44-4003-b9a6-5bbad733e2a5	fdb36615-d7b0-4b83-8189-1cf03abbc692	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
a35dec56-901b-407b-b2ad-84c517adfe1e	fdb36615-d7b0-4b83-8189-1cf03abbc692	34154703-e8e1-4857-b50c-5ca928631056	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
894ae829-287a-4f0f-9052-245679cc2849	fdb36615-d7b0-4b83-8189-1cf03abbc692	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
91bbc302-295a-4e7e-8379-03e8a37811ff	fdb36615-d7b0-4b83-8189-1cf03abbc692	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
a554f62b-1a4b-438e-b4f0-9e1f31e73d75	fdb36615-d7b0-4b83-8189-1cf03abbc692	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
fc0b7aba-6b60-4934-a603-8f91fab04af2	fdb36615-d7b0-4b83-8189-1cf03abbc692	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
ab750c4f-c4af-4e9f-b255-ce41b846d234	fdb36615-d7b0-4b83-8189-1cf03abbc692	4db9c2e5-9eda-40b7-8250-71ecfa73b13a	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b03ed89a-0e0a-48e1-ad18-428efe1eeaea	fdb36615-d7b0-4b83-8189-1cf03abbc692	3555ad6e-4378-4820-b377-30e28434a65f	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
87f8ecd5-be86-494c-afa0-81cf9e26c9e4	fdb36615-d7b0-4b83-8189-1cf03abbc692	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
9db80bca-207d-424d-a344-7050047c0861	fdb36615-d7b0-4b83-8189-1cf03abbc692	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
b3349034-3261-4c51-9549-ea52f2db7c89	fdb36615-d7b0-4b83-8189-1cf03abbc692	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00
3c081fdc-30fc-475e-b405-932ece2f9d66	957369fd-7be7-41fd-97f1-e86c258d2829	7c1753ff-f867-44df-8052-6e634163a215	0	0	0	0	0	\N	1	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00
d299fedd-1b28-4518-be96-3731dac46a6f	957369fd-7be7-41fd-97f1-e86c258d2829	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	0	0	0	0	\N	1	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00
26c6149f-1e60-41f5-8618-80fdce4fe1a4	957369fd-7be7-41fd-97f1-e86c258d2829	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	0	0	0	0	\N	1	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00
eb949c86-7535-469c-a6be-0676c53a5ce6	957369fd-7be7-41fd-97f1-e86c258d2829	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	0	0	0	0	\N	1	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00
e3900ae1-4a26-410d-aa8c-87361f985870	957369fd-7be7-41fd-97f1-e86c258d2829	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	0	0	0	0	\N	1	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00
04771847-c34d-4a80-bbce-150d073e3e19	1433c190-f1ad-40e2-adf2-6f900f7eea91	7d302c30-4506-41a2-9eca-43e47ce03631	1	56.21617188	55.71448167	62.39938905	52.89905435	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
c527a77d-5360-4194-a8e0-4bb9d371115d	1433c190-f1ad-40e2-adf2-6f900f7eea91	c98215ca-b233-49f6-a9f3-3dd0e34c1011	2	56.97585209	55.43800167	63.37429672	53.83714623	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
77249b90-8ced-47eb-9b2b-0e56d01476fe	1433c190-f1ad-40e2-adf2-6f900f7eea91	95d3b712-09f7-4750-88ae-376680c67a8a	3	57.94790979	55.60144167	70.59616725	51.38096463	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
9e2a2e1d-ed4b-4720-969a-c79ad32162ed	1433c190-f1ad-40e2-adf2-6f900f7eea91	93ca2b38-7487-4e9a-b57a-98cf962050b9	4	56.79424192	55.90618167	63.65032743	53.43512538	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
2471b13c-29ca-4fd3-bf6c-836de4c9d5f8	1433c190-f1ad-40e2-adf2-6f900f7eea91	aa538b11-123d-4ce6-a85f-1954d88dca71	5	56.80952993	56.18644167	62.94965061	53.94624858	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
4cf18462-e0b1-4aa0-a998-ea43b1914281	1433c190-f1ad-40e2-adf2-6f900f7eea91	34154703-e8e1-4857-b50c-5ca928631056	6	56.09270605	56.23144167	64.89706993	53.27048494	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
b80f33cc-800f-4e5f-99cc-1e39278aadd5	1433c190-f1ad-40e2-adf2-6f900f7eea91	368ba3e3-7b6d-4a4d-95ab-af081466c45a	7	58.63581414	60.76924167	60.70497774	57.26536656	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
48fecb24-3f47-4bc3-8778-f1022d369dd6	1433c190-f1ad-40e2-adf2-6f900f7eea91	50c728b4-196e-4a63-8406-6031609368ed	8	57.81632252	60.90267167	64.76944806	53.51356619	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
010ad51a-a2ce-421d-833c-18ed07abe732	1433c190-f1ad-40e2-adf2-6f900f7eea91	7c1753ff-f867-44df-8052-6e634163a215	9	56.06589084	54.93591042	63.59434346	52.57719834	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
edf7393a-56b5-4263-8577-58bf96c418b6	1433c190-f1ad-40e2-adf2-6f900f7eea91	a72fd561-0a12-47ba-8d4b-35bfade8497c	10	56.46471664	55.95280167	63.57926743	53.95714119	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
532d2baf-66bd-4379-a9f2-16f5f395b7b2	1433c190-f1ad-40e2-adf2-6f900f7eea91	b6288334-84e9-4346-9540-9db9d25ebf18	11	56.91800914	56.15536167	64.02379993	54.41961789	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
5c62ad0a-45b8-4efb-859f-97918e221212	1433c190-f1ad-40e2-adf2-6f900f7eea91	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	12	56.81745164	55.06343667	65.58531815	53.35660369	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
d92c656f-a984-4853-87ee-3d1cdf01f0c9	1433c190-f1ad-40e2-adf2-6f900f7eea91	3555ad6e-4378-4820-b377-30e28434a65f	13	55.91358664	53.89268667	66.42431368	54.13569244	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
87fe067e-476b-4c6a-9270-ed3e0d5c4904	1433c190-f1ad-40e2-adf2-6f900f7eea91	4db9c2e5-9eda-40b7-8250-71ecfa73b13a	14	57.73898914	62.30618667	66.11488243	52.43078494	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
3b777c0c-304e-4baf-a65d-3fe12824d7a7	1433c190-f1ad-40e2-adf2-6f900f7eea91	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	15	66.56801782	95.87493042	63.60821368	55.60219327	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
8062c0bc-e81b-4998-9c8f-01c2eee6a37c	1433c190-f1ad-40e2-adf2-6f900f7eea91	b9e90030-eec1-4140-b55d-cb558b60ca6c	16	69.22921193	100.5933417	63.49786993	54.15897244	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
2dbc4617-a8a3-474e-88d7-1da6a2b3fca4	1433c190-f1ad-40e2-adf2-6f900f7eea91	c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	17	57.85295164	61.87958667	61.14943243	55.01723494	\N	1	t	f	2022-08-02 17:14:57.360226+00	2022-08-02 17:14:57.360226+00
fe910b57-2dbf-49d5-a80f-d6f591f673ec	dc423d3f-e28e-4913-9343-236c705cb3f2	50c728b4-196e-4a63-8406-6031609368ed	1	51.70930623	46.57718368	51.12419338	57.02658736	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	dc423d3f-e28e-4913-9343-236c705cb3f2	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	2	52.65322761	46.61858368	51.73081113	58.76072479	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
14f08771-1399-468f-a43a-3f6778e31515	dc423d3f-e28e-4913-9343-236c705cb3f2	7d302c30-4506-41a2-9eca-43e47ce03631	3	54.08721288	47.69055	52.90409847	61.22243905	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
611258a1-372e-4b91-ae60-cdda78ebb0f6	dc423d3f-e28e-4913-9343-236c705cb3f2	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	53.70618107	46.95658368	52.58957132	62.35892964	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
e8dae1e5-c031-46a8-988e-aca548c3175b	dc423d3f-e28e-4913-9343-236c705cb3f2	8bd83a59-ffa6-4a99-9d9c-d258abe64802	5	53.90708124	59.52133158	51.96972843	57.35987013	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
1917f851-c1b1-43ec-851c-2677aa60e000	dc423d3f-e28e-4913-9343-236c705cb3f2	7c7385f1-259e-4e9b-bed3-031a2ed5041c	6	52.8725667	46.99298368	51.68516466	61.39584578	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
2328b2bc-b8b6-4052-9c50-348171f62d86	dc423d3f-e28e-4913-9343-236c705cb3f2	368ba3e3-7b6d-4a4d-95ab-af081466c45a	7	52.75278955	47.27858368	51.50729895	60.05529084	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
fa6d1be7-4be9-4b26-b037-466a51ee70d8	dc423d3f-e28e-4913-9343-236c705cb3f2	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	8	52.83766601	46.99338368	51.40203657	59.64212405	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	dc423d3f-e28e-4913-9343-236c705cb3f2	394e070d-2570-48e2-90ba-a2622a8b4925	9	55.06685944	47.98358368	55.24906955	60.17907699	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
9949f9a3-921d-4dfd-96c6-00774dd210e0	dc423d3f-e28e-4913-9343-236c705cb3f2	42dd513a-7a48-4389-a17d-d78aadce80c3	10	49.93313426	47.57592544	48.41338798	55.25504256	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
05aa3705-60f0-409e-9fc1-34a2f0795665	dc423d3f-e28e-4913-9343-236c705cb3f2	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	11	51.9859571	47.05918368	51.31481872	57.22682443	\N	1	t	f	2022-09-08 09:49:38.620253+00	2022-09-08 09:49:38.620253+00
\.


--
-- TOC entry 3201 (class 0 OID 19594)
-- Dependencies: 287
-- Data for Name: eventRounds; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."eventRounds" (id, "eventId", "roundId", "roundStatus", "startDate", "endDate", "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
caaf3032-c14e-4aa1-9996-bf845d1a6035	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	3	2022-09-08 11:20:00+00	2022-09-08 11:06:00.587+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
98b7e80d-b5dc-4969-93ad-a93446c249c3	dc423d3f-e28e-4913-9343-236c705cb3f2	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	3	2022-09-08 12:00:00+00	2022-09-08 11:57:43.452+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
f2655fd9-f59b-4ceb-8915-49a3def149b3	dc423d3f-e28e-4913-9343-236c705cb3f2	4b496d6e-0df9-4c10-8751-68538cc421c6	3	2022-09-08 12:20:00+00	2022-09-08 11:57:43.483+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
795ff82e-df9c-463f-832d-44e110470c0e	dc423d3f-e28e-4913-9343-236c705cb3f2	8cc07e8c-7eb1-4312-ab39-1aee7f79ad8b	3	2022-09-08 12:30:00+00	2022-09-08 11:57:43.498+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
d13a309a-0fd2-4eb0-909d-872923cb91d8	dc423d3f-e28e-4913-9343-236c705cb3f2	5de150a2-605d-42ee-811f-1a2bb6ef47c7	3	2022-09-08 13:00:00+00	2022-09-08 12:08:00.397+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
dee3fe7f-d444-40fb-adb5-3bc519d998c2	dc423d3f-e28e-4913-9343-236c705cb3f2	366d5d10-e54c-442b-b555-dc354f445cf6	3	2022-09-08 13:20:00+00	2022-09-08 12:36:32.789+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
d3fa2fb8-1673-4f4c-a5c1-53a0ce8285f2	dc423d3f-e28e-4913-9343-236c705cb3f2	f3299bb1-5824-4697-971f-3190a46891cb	3	2022-09-08 13:30:00+00	2022-09-08 12:36:32.806+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
7e04c3f8-8a44-4958-827f-40b26b783c46	dc423d3f-e28e-4913-9343-236c705cb3f2	2fe05eb0-3188-4ebb-8ec8-1303669ef859	3	2022-09-08 13:40:00+00	2022-09-08 12:36:32.814+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
e03afdb7-48c8-4f6f-b516-ae65e80114bd	dc423d3f-e28e-4913-9343-236c705cb3f2	ac5a9f87-fa9d-4c1d-a248-4fb6128022dc	3	2022-09-08 10:40:00+00	2022-09-08 10:04:35.204+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
95552b1f-a365-4255-be69-2fe4de04c0e0	dc423d3f-e28e-4913-9343-236c705cb3f2	f81f1890-fd94-49bb-a3d4-cf165662bd63	3	2022-09-08 11:00:00+00	2022-09-08 10:07:05.032+00	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
4cdc5fc5-e423-47ce-8d41-bda72133dc8f	daa1e513-a5e0-4206-86bd-2fa277eab3d0	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
03d25c11-e820-4099-a257-679d3667046d	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
aae008f5-3dcf-4603-87ea-e614dc095ec0	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
4a0474ee-c52e-4b0f-b7cb-0a00d025eac5	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
6ebe7f77-65e7-4b78-8f07-04a5e42a9eeb	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
5775ab31-e930-4fcc-9be8-97d7e6f84756	08709cdd-7882-4e18-9b0f-70c0c1efa889	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
4057018c-b83d-45c0-8439-8dabb4487352	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
6d3d7b40-31be-47c5-87c4-04dce58f2068	08709cdd-7882-4e18-9b0f-70c0c1efa889	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
1dc2c63f-a51f-4ea3-a6e5-079d5dd3ebbf	08709cdd-7882-4e18-9b0f-70c0c1efa889	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
034bb94e-8319-454c-b740-fc167e4ca76e	08709cdd-7882-4e18-9b0f-70c0c1efa889	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
95f072a2-8c28-4b09-946c-3f94d6eb289f	3ecc113e-20a8-4c70-9608-b47ad56d0079	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
110bc839-cc11-458b-9412-2544bc205e36	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
f6c186c8-926e-44be-979b-97df3ae0a86c	3ecc113e-20a8-4c70-9608-b47ad56d0079	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
c0539f59-67b2-4ef4-81f6-32aa4baa1faa	3ecc113e-20a8-4c70-9608-b47ad56d0079	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
6f0dac22-ab2a-4aaa-8b42-c31b2ca1ff8a	3ecc113e-20a8-4c70-9608-b47ad56d0079	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
a4b8069a-ae1d-42f0-a82c-5c8f1648cdc1	3cd79f71-bb2c-49de-b0f4-da603ca913b3	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
5c98e96d-6f6f-4fef-8d14-725f042365b0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
52ce5f5b-9174-4930-94cf-9b44ae9a0fa3	3cd79f71-bb2c-49de-b0f4-da603ca913b3	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
d4257d3a-e967-4acb-90a8-defd42909c29	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
49d3672b-557b-4fa8-81a8-04978105398f	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
6db5fbdc-3456-4dd5-9db2-c6ac9ab81bec	fdb36615-d7b0-4b83-8189-1cf03abbc692	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
124def48-a9e7-4ab1-9a52-ebba183e730a	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
954f89c6-bf1f-401d-bc0c-e50de97c6fc8	fdb36615-d7b0-4b83-8189-1cf03abbc692	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
163e70fc-c9cc-4be4-8934-133755ea5591	fdb36615-d7b0-4b83-8189-1cf03abbc692	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
5c49e6d7-ec00-45e4-8a0b-006953dd51a3	fdb36615-d7b0-4b83-8189-1cf03abbc692	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
23fd54b4-35ee-4381-95f6-9617fb10759a	957369fd-7be7-41fd-97f1-e86c258d2829	17042ce5-3659-4f47-bb48-5e344103858b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
39d24c99-316f-4595-8b2f-74546ac8bea1	957369fd-7be7-41fd-97f1-e86c258d2829	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
f9ca8c5a-c467-47e9-964c-e2828dfe149a	957369fd-7be7-41fd-97f1-e86c258d2829	4a2922e1-5c33-4f1d-be15-6968eab54ca9	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
b4602cfb-2915-49d8-b5e6-133f28e7b4fb	957369fd-7be7-41fd-97f1-e86c258d2829	a9e50421-3d73-4262-87bf-d81e3aab3e40	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
712397e7-193a-4c40-b285-03b7fc868f4a	957369fd-7be7-41fd-97f1-e86c258d2829	a9094671-2922-49ef-bf2a-65e82347847c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
c06b9aa4-d6e2-4122-ac25-2c2731189538	957369fd-7be7-41fd-97f1-e86c258d2829	93606461-741f-4490-ae3b-8e32cbccd21c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
57339bca-38f3-493f-9864-83f4718f5072	957369fd-7be7-41fd-97f1-e86c258d2829	3c27eb8d-d90e-4b33-8575-0ea901b0846b	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
dde29986-a60a-4f97-9645-b5d2ef6c70d4	957369fd-7be7-41fd-97f1-e86c258d2829	7822840f-9c27-41fe-bfa5-ae860943f33c	3	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
4ea63f07-9c23-4736-b9c1-8e42c5283c27	1433c190-f1ad-40e2-adf2-6f900f7eea91	ac5a9f87-fa9d-4c1d-a248-4fb6128022dc	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
f5cca98c-424f-4a1c-9bd5-dcc51395b001	1433c190-f1ad-40e2-adf2-6f900f7eea91	f81f1890-fd94-49bb-a3d4-cf165662bd63	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
3a77c4aa-f642-4e51-ae8b-0de7e7446938	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
d555f02c-9d86-4bdd-8ff5-8f7e6965fae5	1433c190-f1ad-40e2-adf2-6f900f7eea91	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
446e2a2b-5a17-4895-827c-f34c1cd31572	1433c190-f1ad-40e2-adf2-6f900f7eea91	4b496d6e-0df9-4c10-8751-68538cc421c6	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
3adce1ec-b068-4ada-81f6-bdb50b8c263e	1433c190-f1ad-40e2-adf2-6f900f7eea91	8cc07e8c-7eb1-4312-ab39-1aee7f79ad8b	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
37767c51-b843-41a3-b3c4-a1ddc1fd16db	1433c190-f1ad-40e2-adf2-6f900f7eea91	26a5b26f-e0cf-48b4-99d3-3dcc8b13e5a1	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
2e4369e8-b0f8-4d4e-bde3-ef9fd417909f	1433c190-f1ad-40e2-adf2-6f900f7eea91	366d5d10-e54c-442b-b555-dc354f445cf6	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
dbf49191-3bd7-4275-b64b-2cc3798a235b	1433c190-f1ad-40e2-adf2-6f900f7eea91	f3299bb1-5824-4697-971f-3190a46891cb	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
b3a6b4be-bbd6-402d-a31f-c23998f07e7b	1433c190-f1ad-40e2-adf2-6f900f7eea91	2fe05eb0-3188-4ebb-8ec8-1303669ef859	2	\N	\N	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
\.


--
-- TOC entry 3199 (class 0 OID 19551)
-- Dependencies: 285
-- Data for Name: events; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx.events (id, "tourYearId", name, "startDate", "endDate", "eventNumber", "eventStatus", "eventLocation", "eventLocationGroup", "isEventWinnerMarketOpen", "isActive", "isArchived", "createdAt", "updatedAt", "providerRunId", "categoryName") FROM stdin;
daa1e513-a5e0-4206-86bd-2fa277eab3d0	79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	Salt Lake City	2019-04-03 00:00:00+00	2019-04-13 00:00:00+00	1	3	Utah Motorsports Campus, Erda, Utah, United States	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
08709cdd-7882-4e18-9b0f-70c0c1efa889	79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	Elk River	2019-04-17 00:00:00+00	2019-04-27 00:00:00+00	2	3	ERX Motor Park, USA	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
3ecc113e-20a8-4c70-9608-b47ad56d0079	79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	Phoenix	2019-05-13 00:00:00+00	2019-05-25 00:00:00+00	3	3	Wild Horse Pass Motorsports Park, USA	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
3cd79f71-bb2c-49de-b0f4-da603ca913b3	79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	Glen Helen	2019-05-29 00:00:00+00	2019-06-09 00:00:00+00	4	3	Glen Helen Raceway, USA	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
fdb36615-d7b0-4b83-8189-1cf03abbc692	79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	The Firm	2019-07-20 00:00:00+00	2019-07-28 00:00:00+00	5	3	The Firm, USA	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
957369fd-7be7-41fd-97f1-e86c258d2829	5afc4f51-801b-4dd9-bca4-2af95c743389	Round 1: Lydden Hill	2019-07-09 00:00:00+00	2019-07-22 00:00:00+00	6	3	Lydden Hill Race Circuit, Canterbury, United Kingdom	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
1433c190-f1ad-40e2-adf2-6f900f7eea91	5afc4f51-801b-4dd9-bca4-2af95c743389	Round 2: Strangas	2022-07-30 00:00:00+00	2022-07-30 00:00:00+00	7	2	Lydden Hill Race Circuit, Canterbury, United Kingdom	\N	t	t	f	2022-08-02 09:41:53.240106+00	2022-08-02 09:41:53.240106+00	\N	SUPERCAR
dc423d3f-e28e-4913-9343-236c705cb3f2	5afc4f51-801b-4dd9-bca4-2af95c743389	Practice 1	2022-09-08 10:00:00+00	2022-09-08 12:36:32.838+00	\N	3	\N	\N	f	t	f	2022-09-08 09:04:10.565366+00	2022-09-08 09:04:10.565366+00	8556	GROUP E
\.


--
-- TOC entry 3206 (class 0 OID 19730)
-- Dependencies: 292
-- Data for Name: oddDerivatives; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."oddDerivatives" (id, name, type, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3209 (class 0 OID 28422)
-- Dependencies: 296
-- Data for Name: playerHeadToHeads; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."playerHeadToHeads" (id, "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "holdingPercentage", voided, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
15404234-2861-495b-a53f-fc1167b66a37	1433c190-f1ad-40e2-adf2-6f900f7eea91	04771847-c34d-4a80-bbce-150d073e3e19	2471b13c-29ca-4fd3-bf6c-836de4c9d5f8	\N	\N	\N	1.1506	7.6394	86.91	13.09	86.91	13.09	f	f	100	f	t	f	2022-08-02 18:08:36.656627+00	2022-08-02 18:08:36.656627+00
\.


--
-- TOC entry 3205 (class 0 OID 19697)
-- Dependencies: 291
-- Data for Name: projectionEventHeatOutcome; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."projectionEventHeatOutcome" (id, "eventId", "eventParticipantId", "roundHeatId", "position", odds, "trueProbability", "hasModifiedProbability", probability, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
c22c951c-8338-4863-bf75-181b28796f86	1433c190-f1ad-40e2-adf2-6f900f7eea91	04771847-c34d-4a80-bbce-150d073e3e19	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	13.947	7.17	f	7.17	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
e2ca0da1-b826-4fef-ac25-6bbce44403cd	1433c190-f1ad-40e2-adf2-6f900f7eea91	c527a77d-5360-4194-a8e0-4bb9d371115d	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	10.2881	9.72	f	9.72	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
6e451d3a-aa98-44c5-970b-43a8c1310493	1433c190-f1ad-40e2-adf2-6f900f7eea91	77249b90-8ced-47eb-9b2b-0e56d01476fe	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	12.9702	7.71	f	7.71	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
cb3e2e59-fb4c-4b1a-bc07-f147d41a99f1	1433c190-f1ad-40e2-adf2-6f900f7eea91	9e2a2e1d-ed4b-4720-969a-c79ad32162ed	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	16.8634	5.93	f	5.93	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
19d36145-54d8-4bc5-a5be-65749e822fd6	1433c190-f1ad-40e2-adf2-6f900f7eea91	2471b13c-29ca-4fd3-bf6c-836de4c9d5f8	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	21.5517	4.64	f	4.64	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
8ed539fb-f3fa-4ab6-a355-de925a813f56	1433c190-f1ad-40e2-adf2-6f900f7eea91	4cf18462-e0b1-4aa0-a998-ea43b1914281	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	23.4192	4.27	f	4.27	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
41724964-518e-4eab-933e-9451b03fd54b	1433c190-f1ad-40e2-adf2-6f900f7eea91	b80f33cc-800f-4e5f-99cc-1e39278aadd5	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	10000	0.01	f	0.01	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
cd663ae4-7343-4fea-8f3c-c9385b1cc999	1433c190-f1ad-40e2-adf2-6f900f7eea91	48fecb24-3f47-4bc3-8778-f1022d369dd6	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
83fb25d6-e3e5-4915-af3e-334348cfecdb	1433c190-f1ad-40e2-adf2-6f900f7eea91	010ad51a-a2ce-421d-833c-18ed07abe732	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	6.9735	14.34	f	14.34	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
d8c9432d-4c3c-4651-b7a1-a22fed1431db	1433c190-f1ad-40e2-adf2-6f900f7eea91	edf7393a-56b5-4263-8577-58bf96c418b6	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	18.9394	5.28	f	5.28	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
34f83923-38fc-4acd-a652-4c82c478e3a0	1433c190-f1ad-40e2-adf2-6f900f7eea91	532d2baf-66bd-4379-a9f2-16f5f395b7b2	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	21.4592	4.66	f	4.66	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
b4e05c23-93e2-47be-845a-17cd79f91838	1433c190-f1ad-40e2-adf2-6f900f7eea91	5c62ad0a-45b8-4efb-859f-97918e221212	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	8.0906	12.36	f	12.36	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
bfad7e5d-2d36-4d24-aefb-3c9289903d14	1433c190-f1ad-40e2-adf2-6f900f7eea91	d92c656f-a984-4853-87ee-3d1cdf01f0c9	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	4.1824	23.91	f	23.91	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
7d4aeb36-51b5-4181-9385-c36888faa72c	1433c190-f1ad-40e2-adf2-6f900f7eea91	87fe067e-476b-4c6a-9270-ed3e0d5c4904	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
993fe796-4479-42b8-a98d-3f41a0c26737	1433c190-f1ad-40e2-adf2-6f900f7eea91	3b777c0c-304e-4baf-a65d-3fe12824d7a7	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
aa57f2fd-269d-429c-9542-b1faa24514b5	1433c190-f1ad-40e2-adf2-6f900f7eea91	8062c0bc-e81b-4998-9c8f-01c2eee6a37c	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
432d085b-36eb-4427-a4dc-5f0c17b2f264	1433c190-f1ad-40e2-adf2-6f900f7eea91	2dbc4617-a8a3-474e-88d7-1da6a2b3fca4	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
feea85d8-88f1-43cd-846e-cc098bf109f4	dc423d3f-e28e-4913-9343-236c705cb3f2	fa6d1be7-4be9-4b26-b037-466a51ee70d8	83b71781-bb93-478f-b235-51d0754740cd	1	8.8652	11.28	f	11.28	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
9223667c-79f3-4da6-806e-7c93a55895be	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	83b71781-bb93-478f-b235-51d0754740cd	1	16.6945	5.99	f	5.99	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
b71ea803-e5c4-42a0-9aeb-4ee182c5cfe3	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	83b71781-bb93-478f-b235-51d0754740cd	1	11.7096	8.54	f	8.54	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
9bcf92cd-0192-4f76-9b0f-0707c2d652d5	dc423d3f-e28e-4913-9343-236c705cb3f2	05aa3705-60f0-409e-9fc1-34a2f0795665	83b71781-bb93-478f-b235-51d0754740cd	1	9.3721	10.67	f	10.67	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
dceb8d1c-495f-4c9a-90fe-64366943eebe	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	83b71781-bb93-478f-b235-51d0754740cd	1	6.7568	14.8	f	14.8	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
3baa5faa-6cec-4405-abc1-b343a3329220	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	83b71781-bb93-478f-b235-51d0754740cd	1	0	0	f	0	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
1429dc00-5403-4f70-bfb5-d5dbecaa15f3	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	83b71781-bb93-478f-b235-51d0754740cd	1	14.8368	6.74	f	6.74	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
d55752ab-9e5a-4607-bfb6-666d9bcf7839	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	83b71781-bb93-478f-b235-51d0754740cd	1	23.0947	4.33	f	4.33	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
f23532e5-f35e-42ea-b180-b967e67eb399	dc423d3f-e28e-4913-9343-236c705cb3f2	635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	83b71781-bb93-478f-b235-51d0754740cd	1	6.8823	14.53	f	14.53	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
fd5ff4d0-924c-4d54-9bdc-f5531074eec9	dc423d3f-e28e-4913-9343-236c705cb3f2	611258a1-372e-4b91-ae60-cdda78ebb0f6	83b71781-bb93-478f-b235-51d0754740cd	1	8.6356	11.58	f	11.58	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
3ca0acf7-5638-4c2f-8dd7-ed395be5a665	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	83b71781-bb93-478f-b235-51d0754740cd	1	8.6655	11.54	f	11.54	t	f	2022-09-08 10:03:29.101052+00	2022-09-08 10:03:29.101052+00
2a189bd7-db23-4ca1-bf0c-e3f8ea66690b	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	11.4025	8.77	f	8.77	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
2c54ecb3-481c-4002-bc01-e3c6837b240d	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	0	0	f	0	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
6d7f7980-55d2-4753-9a1d-5bb7cb9aa6ed	dc423d3f-e28e-4913-9343-236c705cb3f2	635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	5000	0.02	f	0.02	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
172e8f8f-bda9-4daf-b9c7-5b038bc152c9	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	1.0964	91.21	f	91.21	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
d2b483af-1010-422d-acd1-516663f86d69	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	0	0	f	0	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
2d496449-1ce1-4862-81dd-dfa5104ee474	dc423d3f-e28e-4913-9343-236c705cb3f2	fa6d1be7-4be9-4b26-b037-466a51ee70d8	2f35730a-4162-4acf-afc6-ea661c8a69b3	1	0	0	f	0	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
a8509c3a-0298-43eb-9061-fcf243a09032	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	b260a745-649f-4d5e-b437-641e1660a63a	1	2.3332	42.86	f	42.86	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
1c08e8ce-053b-41ee-a303-7d46153fd1c9	dc423d3f-e28e-4913-9343-236c705cb3f2	05aa3705-60f0-409e-9fc1-34a2f0795665	b260a745-649f-4d5e-b437-641e1660a63a	1	1.7519	57.08	f	57.08	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
37ab5329-f9eb-4f73-b226-a17b25dc6c23	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	b260a745-649f-4d5e-b437-641e1660a63a	1	10000	0.01	f	0.01	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
af331e81-26cb-45b3-8dac-aa3a366840ca	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	b260a745-649f-4d5e-b437-641e1660a63a	1	2000	0.05	f	0.05	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
271c1594-1bb5-40a7-829e-c9dc59cc85be	dc423d3f-e28e-4913-9343-236c705cb3f2	611258a1-372e-4b91-ae60-cdda78ebb0f6	b260a745-649f-4d5e-b437-641e1660a63a	1	0	0	f	0	t	f	2022-09-08 10:07:16.505706+00	2022-09-08 10:07:16.505706+00
4fd45da3-f589-4f66-8494-3445c9e12dea	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	4619db71-3c14-4a87-876a-c4bb97ad68d2	1	2.3987	41.69	f	41.69	t	f	2022-09-08 10:07:30.600399+00	2022-09-08 10:07:30.600399+00
356c6d91-f65c-4559-b141-30086350439c	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	4619db71-3c14-4a87-876a-c4bb97ad68d2	1	1.715	58.31	f	58.31	t	f	2022-09-08 10:07:30.600399+00	2022-09-08 10:07:30.600399+00
9942b672-3c1c-4d02-a01c-3b513f77747a	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	49a8aafa-81b9-4c3b-800a-b962f8f485dc	1	1	100	f	100	t	f	2022-09-08 10:07:30.600399+00	2022-09-08 10:07:30.600399+00
0e8254f7-0f2f-445e-ae00-6021b3fec24d	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	1317a876-b03b-48ae-94ad-c916a8954cf9	1	1.0328	96.82	f	96.82	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
b1967bd3-e891-430e-8537-420e09e4f228	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	1317a876-b03b-48ae-94ad-c916a8954cf9	1	31.4465	3.18	f	3.18	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
a69da18b-bcba-4e6e-8f42-43634421d733	dc423d3f-e28e-4913-9343-236c705cb3f2	635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	07d05024-6538-4057-bad3-c39e73437824	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
99156ec9-8be6-4102-9e48-7809e502ca43	dc423d3f-e28e-4913-9343-236c705cb3f2	05aa3705-60f0-409e-9fc1-34a2f0795665	07d05024-6538-4057-bad3-c39e73437824	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
86d1ef27-8b07-4c30-8762-05999ba09125	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	1719d40e-0ce9-453f-a235-79539d6e80fa	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
0b76ffc4-d9ee-43f3-a41a-d4f6744c1728	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	1719d40e-0ce9-453f-a235-79539d6e80fa	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
3b8a28a6-2b4e-41c3-90e5-0abb02332bb5	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	1850b65d-3e30-4247-b1f1-e0a2af939784	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
7d676398-2f7c-4025-9005-2a3211ee83d6	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	1850b65d-3e30-4247-b1f1-e0a2af939784	1	0	0	f	0	t	f	2022-09-08 11:42:41.853847+00	2022-09-08 11:42:41.853847+00
046a75a1-8bf5-4b55-8c65-6d71fc052d9c	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	8a04d0df-cbd9-4958-8810-c9e55c202072	1	1.0265	97.42	f	97.42	t	f	2022-09-08 11:58:11.943851+00	2022-09-08 11:58:11.943851+00
eeba81de-c667-4cb4-8e2e-e4a3fa4893a0	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	8a04d0df-cbd9-4958-8810-c9e55c202072	1	74.0741	1.35	f	1.35	t	f	2022-09-08 11:58:11.943851+00	2022-09-08 11:58:11.943851+00
be0b514d-77c3-4f20-8575-f725403646f1	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	8a04d0df-cbd9-4958-8810-c9e55c202072	1	81.3008	1.23	f	1.23	t	f	2022-09-08 11:58:11.943851+00	2022-09-08 11:58:11.943851+00
5713b697-94e7-4aac-a5db-b554aaa30465	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	1e147a9f-e534-4af7-8ef6-de08c6850673	1	1.8073	55.33	f	55.33	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
a91adb5b-e2dc-4629-968c-ff67ccab7b25	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	1e147a9f-e534-4af7-8ef6-de08c6850673	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
86072d52-0c89-4477-b34d-ff8f9a41710f	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	1e147a9f-e534-4af7-8ef6-de08c6850673	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
b5c621d6-2564-4d2f-b8a1-a03db8f50a64	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	1e147a9f-e534-4af7-8ef6-de08c6850673	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
516f27fb-dbb4-45b8-9e4e-66fa992cd914	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	1e147a9f-e534-4af7-8ef6-de08c6850673	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
69c7018c-d908-499d-8360-1b19ea61780c	dc423d3f-e28e-4913-9343-236c705cb3f2	fa6d1be7-4be9-4b26-b037-466a51ee70d8	1e147a9f-e534-4af7-8ef6-de08c6850673	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
\.


--
-- TOC entry 3204 (class 0 OID 19670)
-- Dependencies: 290
-- Data for Name: projectionEventOutcome; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."projectionEventOutcome" (id, "eventId", "eventParticipantId", "position", odds, "trueProbability", "hasModifiedProbability", probability, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
4638f04a-7b6e-446d-be56-884a4539fa1e	dc423d3f-e28e-4913-9343-236c705cb3f2	fa6d1be7-4be9-4b26-b037-466a51ee70d8	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
6a9dea96-8cf5-4476-ba3b-91211fde717b	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
0940eee0-3b8d-414f-af0b-5046ed4bfbc4	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
21c05077-3696-4c7f-8d26-f0b46f39c172	dc423d3f-e28e-4913-9343-236c705cb3f2	05aa3705-60f0-409e-9fc1-34a2f0795665	1	263.1579	0.38	f	0.38	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
6d5deba2-4d49-485f-8052-6df03a7217ad	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	1	56.4972	1.77	f	1.77	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
6266b379-e94e-444b-8c99-e0edb9d0c05e	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	1	10000	0.01	f	0.01	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
c29bfc59-6719-4778-bd6c-8258ab8e8682	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	1	1.0221	97.84	f	97.84	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
1edfda74-a6ad-4def-895f-fd3ce9fd1a85	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
7c6f1493-4251-4ac1-a4bf-ca442d16c1e5	dc423d3f-e28e-4913-9343-236c705cb3f2	635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
ea0d1520-a2ea-4417-81ec-71626639a9d3	dc423d3f-e28e-4913-9343-236c705cb3f2	611258a1-372e-4b91-ae60-cdda78ebb0f6	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
7fb60fa2-dde8-420d-ade6-985fc8532b19	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	1	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
1428e98c-cf07-484a-a76f-a3379a1be22c	dc423d3f-e28e-4913-9343-236c705cb3f2	fa6d1be7-4be9-4b26-b037-466a51ee70d8	2	10000	0.01	f	0.01	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
af979e0e-9c53-4c67-9c67-94c9d0a0c1e9	dc423d3f-e28e-4913-9343-236c705cb3f2	14f08771-1399-468f-a43a-3f6778e31515	2	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
7c895246-be3b-4016-ad9e-231af8c57622	dc423d3f-e28e-4913-9343-236c705cb3f2	2328b2bc-b8b6-4052-9c50-348171f62d86	2	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
628c756f-9419-4a52-be19-b26ac274ed51	dc423d3f-e28e-4913-9343-236c705cb3f2	05aa3705-60f0-409e-9fc1-34a2f0795665	2	3.0855	32.41	f	32.41	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
95434784-f756-4b69-96bf-d28937dd54af	dc423d3f-e28e-4913-9343-236c705cb3f2	fe910b57-2dbf-49d5-a80f-d6f591f673ec	2	2.2994	43.49	f	43.49	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
bcc3c45d-3a6d-4393-8529-93eb4336ba25	dc423d3f-e28e-4913-9343-236c705cb3f2	e8dae1e5-c031-46a8-988e-aca548c3175b	2	4.6992	21.28	f	21.28	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
41a40d53-2717-4700-ab87-d89a8b2c12c6	dc423d3f-e28e-4913-9343-236c705cb3f2	9949f9a3-921d-4dfd-96c6-00774dd210e0	2	49.0196	2.04	f	2.04	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
0e63ac24-bc13-4fe2-b28f-5ecc4d9cedd6	dc423d3f-e28e-4913-9343-236c705cb3f2	3b4f4dd5-d4b6-49d6-823e-78bf767f36b9	2	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
0e6cdb6f-f452-42d9-9b38-42233c92a953	dc423d3f-e28e-4913-9343-236c705cb3f2	635e8d51-f4c0-4c7f-bc1c-9beb83a637f1	2	129.8701	0.77	f	0.77	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
0dea4923-1568-48ae-8cfa-7d5b02cb767a	dc423d3f-e28e-4913-9343-236c705cb3f2	611258a1-372e-4b91-ae60-cdda78ebb0f6	2	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
2387bf46-0fc5-4e8d-b673-2502ebbcf081	dc423d3f-e28e-4913-9343-236c705cb3f2	1917f851-c1b1-43ec-851c-2677aa60e000	2	0	0	f	0	t	f	2022-09-08 12:00:19.535773+00	2022-09-08 12:00:19.535773+00
8b59c051-8595-4dc2-a716-83b8e6836478	1433c190-f1ad-40e2-adf2-6f900f7eea91	04771847-c34d-4a80-bbce-150d073e3e19	1	3.6996	27.03	f	27.03	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
0857cb07-b7e5-4ee0-b7e9-05a98567612b	1433c190-f1ad-40e2-adf2-6f900f7eea91	c527a77d-5360-4194-a8e0-4bb9d371115d	1	60.9756	1.64	f	1.64	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
f38e4a46-5fbc-47de-8c7a-527ddcf86b92	1433c190-f1ad-40e2-adf2-6f900f7eea91	77249b90-8ced-47eb-9b2b-0e56d01476fe	1	7.6104	13.14	f	13.14	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
d1d90174-3250-4177-8238-9320c9b1de39	1433c190-f1ad-40e2-adf2-6f900f7eea91	9e2a2e1d-ed4b-4720-969a-c79ad32162ed	1	20.79	4.81	f	4.81	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
6cf3b472-ca2a-4022-bca1-a373c8874ec5	1433c190-f1ad-40e2-adf2-6f900f7eea91	2471b13c-29ca-4fd3-bf6c-836de4c9d5f8	1	80	1.25	f	1.25	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
b716dfe0-aa19-4f62-8d9a-bb3cba0b50a1	1433c190-f1ad-40e2-adf2-6f900f7eea91	4cf18462-e0b1-4aa0-a998-ea43b1914281	1	29.4118	3.4	f	3.4	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
81cf23bd-9a99-4be8-b960-5dd38897f6b8	1433c190-f1ad-40e2-adf2-6f900f7eea91	b80f33cc-800f-4e5f-99cc-1e39278aadd5	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
7a24d5c0-a07e-4bc5-b1ec-4e8175929a1c	1433c190-f1ad-40e2-adf2-6f900f7eea91	48fecb24-3f47-4bc3-8778-f1022d369dd6	1	61.7284	1.62	f	1.62	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
a4803f15-48fa-416c-8a4c-fef3b24100a2	1433c190-f1ad-40e2-adf2-6f900f7eea91	010ad51a-a2ce-421d-833c-18ed07abe732	1	3.2289	30.97	f	30.97	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
63d75c68-c820-41b9-93f5-a702124df3b7	1433c190-f1ad-40e2-adf2-6f900f7eea91	edf7393a-56b5-4263-8577-58bf96c418b6	1	117.6471	0.85	f	0.85	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
7994ae87-c2fc-42cc-9db3-1bf24287bbdf	1433c190-f1ad-40e2-adf2-6f900f7eea91	532d2baf-66bd-4379-a9f2-16f5f395b7b2	1	1250	0.08	f	0.08	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
e5fd6a97-2c1e-4735-a77f-339c60fde864	1433c190-f1ad-40e2-adf2-6f900f7eea91	5c62ad0a-45b8-4efb-859f-97918e221212	1	75.7576	1.32	f	1.32	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
af171b51-1987-47c2-adbb-bd6943cd3417	1433c190-f1ad-40e2-adf2-6f900f7eea91	d92c656f-a984-4853-87ee-3d1cdf01f0c9	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
f69cdfbd-a5a2-4a8f-a5a6-f141c74dfce1	1433c190-f1ad-40e2-adf2-6f900f7eea91	87fe067e-476b-4c6a-9270-ed3e0d5c4904	1	7.278	13.74	f	13.74	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
15cfffd0-75da-4461-8a8f-c44c07d727be	1433c190-f1ad-40e2-adf2-6f900f7eea91	3b777c0c-304e-4baf-a65d-3fe12824d7a7	1	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
23db87c8-d746-4541-bf02-44ba198ed95d	1433c190-f1ad-40e2-adf2-6f900f7eea91	8062c0bc-e81b-4998-9c8f-01c2eee6a37c	1	1250	0.08	f	0.08	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
aadbf08b-8983-4634-8c19-eb30da7651dd	1433c190-f1ad-40e2-adf2-6f900f7eea91	2dbc4617-a8a3-474e-88d7-1da6a2b3fca4	1	1428.5714	0.07	f	0.07	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
7c7072c9-4246-4c13-ae5d-ef527bb6613c	1433c190-f1ad-40e2-adf2-6f900f7eea91	04771847-c34d-4a80-bbce-150d073e3e19	2	5.4348	18.4	f	18.4	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
f85996bb-68ec-49cb-981c-f5f0a37a6ef2	1433c190-f1ad-40e2-adf2-6f900f7eea91	c527a77d-5360-4194-a8e0-4bb9d371115d	2	20.0401	4.99	f	4.99	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
a0b3c274-9f98-441f-b400-4e81cfeb7477	1433c190-f1ad-40e2-adf2-6f900f7eea91	77249b90-8ced-47eb-9b2b-0e56d01476fe	2	9.009	11.1	f	11.1	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
344b3654-dee2-4981-9b0b-72f93476db99	1433c190-f1ad-40e2-adf2-6f900f7eea91	9e2a2e1d-ed4b-4720-969a-c79ad32162ed	2	11.3507	8.81	f	8.81	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
5b46e615-f8b5-429b-a5fc-732e26e4ea7d	1433c190-f1ad-40e2-adf2-6f900f7eea91	2471b13c-29ca-4fd3-bf6c-836de4c9d5f8	2	22.1729	4.51	f	4.51	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
3e8a2829-31c5-4848-9ef6-3a4407ae554a	1433c190-f1ad-40e2-adf2-6f900f7eea91	4cf18462-e0b1-4aa0-a998-ea43b1914281	2	13.3156	7.51	f	7.51	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
42200c59-a4c1-4dd9-b89f-0ddd5f1f7c38	1433c190-f1ad-40e2-adf2-6f900f7eea91	b80f33cc-800f-4e5f-99cc-1e39278aadd5	2	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
2eb1837f-bb6f-4b15-b94d-c6e434f00cc5	1433c190-f1ad-40e2-adf2-6f900f7eea91	48fecb24-3f47-4bc3-8778-f1022d369dd6	2	23.4742	4.26	f	4.26	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
2d1f1653-fe06-4365-8692-8162470b20e7	1433c190-f1ad-40e2-adf2-6f900f7eea91	010ad51a-a2ce-421d-833c-18ed07abe732	2	5.6243	17.78	f	17.78	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
2cae6d59-9326-4cdb-b5cc-d9cf3ace3524	1433c190-f1ad-40e2-adf2-6f900f7eea91	edf7393a-56b5-4263-8577-58bf96c418b6	2	30.2115	3.31	f	3.31	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
36ef3b50-8da2-4672-af58-639584e95f47	1433c190-f1ad-40e2-adf2-6f900f7eea91	532d2baf-66bd-4379-a9f2-16f5f395b7b2	2	250	0.4	f	0.4	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
23a8247a-1941-4b06-acf3-518285c88d74	1433c190-f1ad-40e2-adf2-6f900f7eea91	5c62ad0a-45b8-4efb-859f-97918e221212	2	24.8139	4.03	f	4.03	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
37092413-6240-40d8-a8a6-05966d7d233a	1433c190-f1ad-40e2-adf2-6f900f7eea91	d92c656f-a984-4853-87ee-3d1cdf01f0c9	2	2000	0.05	f	0.05	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
c6e9a42b-b738-4941-a5e1-4a6c497e4e45	1433c190-f1ad-40e2-adf2-6f900f7eea91	87fe067e-476b-4c6a-9270-ed3e0d5c4904	2	7.0721	14.14	f	14.14	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
23b0606b-ac65-4d8b-8c5b-1ff53840f0c5	1433c190-f1ad-40e2-adf2-6f900f7eea91	3b777c0c-304e-4baf-a65d-3fe12824d7a7	2	0	0	f	0	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
dc004263-6bd5-49a8-8a10-9f3f12e2bcb6	1433c190-f1ad-40e2-adf2-6f900f7eea91	8062c0bc-e81b-4998-9c8f-01c2eee6a37c	2	357.1429	0.28	f	0.28	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
65960c58-22c3-4664-9e2e-02228e2be0f8	1433c190-f1ad-40e2-adf2-6f900f7eea91	2dbc4617-a8a3-474e-88d7-1da6a2b3fca4	2	232.5581	0.43	f	0.43	t	f	2022-08-02 18:08:57.015393+00	2022-08-02 18:08:57.015393+00
\.


--
-- TOC entry 3208 (class 0 OID 19764)
-- Dependencies: 294
-- Data for Name: propBets; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."propBets" (id, "eventId", "eventParticipantId", proposition, odds, voided, payout, probability, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3202 (class 0 OID 19616)
-- Dependencies: 288
-- Data for Name: roundHeats; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."roundHeats" (id, "eventId", "roundId", "heatName", "heatNo", "heatStatus", "startDate", "endDate", "isHeatWinnerMarketOpen", "isActive", "isArchived", "createdAt", "updatedAt", "isHeatWinnerMarketVoided", "providerRunId") FROM stdin;
0246e43c-be72-4cbd-9bda-5cd44623e0d2	1433c190-f1ad-40e2-adf2-6f900f7eea91	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
848bc998-8e63-49d2-821f-858aa7dd9cf3	1433c190-f1ad-40e2-adf2-6f900f7eea91	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
dd64d97f-4deb-4d7a-95b6-2f7e94b5c7b5	1433c190-f1ad-40e2-adf2-6f900f7eea91	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	3	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
bf4478b4-ae82-4813-92c7-1ac8cbe692cb	1433c190-f1ad-40e2-adf2-6f900f7eea91	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	4	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
1f1664b6-4dea-494d-be82-1bf154354462	1433c190-f1ad-40e2-adf2-6f900f7eea91	4b496d6e-0df9-4c10-8751-68538cc421c6	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
bf10760d-0c1f-4bc7-81bf-47e48bfd7e5b	1433c190-f1ad-40e2-adf2-6f900f7eea91	4b496d6e-0df9-4c10-8751-68538cc421c6	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3f1e8178-add3-4ac8-a7ca-3a18704c6aa8	1433c190-f1ad-40e2-adf2-6f900f7eea91	8cc07e8c-7eb1-4312-ab39-1aee7f79ad8b	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
1bb86779-9fcc-40c7-9fc2-bb0b02e84d51	1433c190-f1ad-40e2-adf2-6f900f7eea91	26a5b26f-e0cf-48b4-99d3-3dcc8b13e5a1	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
7918b6ea-b487-426d-8e57-f9792666fc66	1433c190-f1ad-40e2-adf2-6f900f7eea91	26a5b26f-e0cf-48b4-99d3-3dcc8b13e5a1	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
af1de068-8019-4bd0-a78e-8d5611bc0e5f	1433c190-f1ad-40e2-adf2-6f900f7eea91	26a5b26f-e0cf-48b4-99d3-3dcc8b13e5a1	Heat	3	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
cb06fb90-2035-4e90-8a54-dc27fe9930f1	1433c190-f1ad-40e2-adf2-6f900f7eea91	366d5d10-e54c-442b-b555-dc354f445cf6	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
28ae4944-6770-40ad-bbfe-eb4e2c1ef1ef	1433c190-f1ad-40e2-adf2-6f900f7eea91	366d5d10-e54c-442b-b555-dc354f445cf6	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ee4de61b-fe8c-4b2f-92a9-21312ccec725	1433c190-f1ad-40e2-adf2-6f900f7eea91	f3299bb1-5824-4697-971f-3190a46891cb	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ea95e21a-ee44-48bf-b632-1e99b707fe67	1433c190-f1ad-40e2-adf2-6f900f7eea91	2fe05eb0-3188-4ebb-8ec8-1303669ef859	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
66057dde-fcf3-4a50-89af-dc4b1d5c85a8	1433c190-f1ad-40e2-adf2-6f900f7eea91	ac5a9f87-fa9d-4c1d-a248-4fb6128022dc	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
a5a4e8dd-8f6f-4724-be25-02027eac01ae	dc423d3f-e28e-4913-9343-236c705cb3f2	5de150a2-605d-42ee-811f-1a2bb6ef47c7	Heat	3	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	\N
9aab7309-331f-417f-a359-17fea37b906d	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	1	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10121
83b71781-bb93-478f-b235-51d0754740cd	dc423d3f-e28e-4913-9343-236c705cb3f2	ac5a9f87-fa9d-4c1d-a248-4fb6128022dc	Heat	1	3	2022-09-08 10:40:00+00	2022-09-08 10:04:35.204+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10002
2f35730a-4162-4acf-afc6-ea661c8a69b3	dc423d3f-e28e-4913-9343-236c705cb3f2	f81f1890-fd94-49bb-a3d4-cf165662bd63	Heat	1	3	2022-09-08 11:00:00+00	2022-09-08 10:07:05.032+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10151
b260a745-649f-4d5e-b437-641e1660a63a	dc423d3f-e28e-4913-9343-236c705cb3f2	f81f1890-fd94-49bb-a3d4-cf165662bd63	Heat	2	3	2022-09-08 11:00:00+00	2022-09-08 10:07:05.032+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10152
4619db71-3c14-4a87-876a-c4bb97ad68d2	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	2	3	2022-09-08 11:20:00+00	2022-09-08 11:06:00.587+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10128
49a8aafa-81b9-4c3b-800a-b962f8f485dc	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	7	3	2022-09-08 11:20:00+00	2022-09-08 11:06:00.587+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10127
1317a876-b03b-48ae-94ad-c916a8954cf9	dc423d3f-e28e-4913-9343-236c705cb3f2	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	1	3	2022-09-08 12:00:00+00	2022-09-08 11:57:43.452+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10129
07d05024-6538-4057-bad3-c39e73437824	dc423d3f-e28e-4913-9343-236c705cb3f2	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	2	3	2022-09-08 12:00:00+00	2022-09-08 11:57:43.452+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10132
1850b65d-3e30-4247-b1f1-e0a2af939784	dc423d3f-e28e-4913-9343-236c705cb3f2	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	4	3	2022-09-08 12:00:00+00	2022-09-08 11:57:43.452+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10130
1719d40e-0ce9-453f-a235-79539d6e80fa	dc423d3f-e28e-4913-9343-236c705cb3f2	bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Heat	3	3	2022-09-08 12:00:00+00	2022-09-08 11:57:43.452+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10131
f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	dc423d3f-e28e-4913-9343-236c705cb3f2	4b496d6e-0df9-4c10-8751-68538cc421c6	Heat	1	3	2022-09-08 12:20:00+00	2022-09-08 11:57:43.483+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10133
3e28eeaa-be9a-4350-9d73-e3abc271fd3f	dc423d3f-e28e-4913-9343-236c705cb3f2	4b496d6e-0df9-4c10-8751-68538cc421c6	Heat	2	3	2022-09-08 12:20:00+00	2022-09-08 11:57:43.483+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10134
25432d3b-14cd-4b50-b5dd-7710e84186a9	dc423d3f-e28e-4913-9343-236c705cb3f2	8cc07e8c-7eb1-4312-ab39-1aee7f79ad8b	Heat	1	3	2022-09-08 12:30:00+00	2022-09-08 11:57:43.498+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10135
1e147a9f-e534-4af7-8ef6-de08c6850673	dc423d3f-e28e-4913-9343-236c705cb3f2	5de150a2-605d-42ee-811f-1a2bb6ef47c7	Heat	1	3	2022-09-08 13:00:00+00	2022-09-08 12:08:00.397+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10401
8a04d0df-cbd9-4958-8810-c9e55c202072	dc423d3f-e28e-4913-9343-236c705cb3f2	5de150a2-605d-42ee-811f-1a2bb6ef47c7	Heat	2	3	2022-09-08 13:00:00+00	2022-09-08 12:08:00.397+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10402
e047a20f-5f3e-4587-bf5b-027c96ff6d8a	dc423d3f-e28e-4913-9343-236c705cb3f2	366d5d10-e54c-442b-b555-dc354f445cf6	Heat	1	3	2022-09-08 13:20:00+00	2022-09-08 12:36:32.789+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10601
54176329-3216-40dd-9e1f-3d50529f8287	dc423d3f-e28e-4913-9343-236c705cb3f2	366d5d10-e54c-442b-b555-dc354f445cf6	Heat	2	3	2022-09-08 13:20:00+00	2022-09-08 12:36:32.789+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10602
2791d4a9-af6f-43d3-a23b-d1b42ecd4842	dc423d3f-e28e-4913-9343-236c705cb3f2	f3299bb1-5824-4697-971f-3190a46891cb	Heat	1	3	2022-09-08 13:30:00+00	2022-09-08 12:36:32.806+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10701
eb266366-691e-4b90-8b82-bb62b8007a4c	dc423d3f-e28e-4913-9343-236c705cb3f2	2fe05eb0-3188-4ebb-8ec8-1303669ef859	Heat	1	3	2022-09-08 13:40:00+00	2022-09-08 12:36:32.814+00	t	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10801
63216b20-c826-4c50-b4ee-b6402bcaeb5b	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	3	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10122
251e9167-a36f-47d5-a962-a2f3c35e441e	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	4	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10123
bdc76a4f-af75-46dd-a4f2-3aeb55c2c914	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	5	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10124
1c7cae27-3c1b-411e-b75a-5bb0cc0bebf1	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	6	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10125
16f93d9e-c888-4f4c-95d7-95c1952575ae	dc423d3f-e28e-4913-9343-236c705cb3f2	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	8	3	\N	\N	f	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00	f	10126
3010621c-c500-44db-955b-7079a549501b	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
b587c8fa-b33c-4c4b-a65b-a8c04f67682b	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
2644bc75-4a5d-4f22-9fa4-90294a4dd48a	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	fdb36615-d7b0-4b83-8189-1cf03abbc692	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3cde7fd0-004a-43bb-9cd4-dee6a7c5765e	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
0233edb1-bc26-40c3-89b2-db50ebb16b33	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
63b41092-7600-4edb-ae2c-ce70d1558827	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
9e9272f3-3c9a-4759-9e14-96d0714f69c5	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
c3c7a90e-9633-4bae-987c-429708b81168	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	5	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
d8868ad4-c8e9-44ac-a979-9245a96c1841	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	6	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5bfbb14d-540c-43bf-8a50-d2619a029c53	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	7	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
a8e9f94a-4115-44a3-a3ea-adc568ecfcaa	fdb36615-d7b0-4b83-8189-1cf03abbc692	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	8	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
4c3059c6-c4bf-4c31-8307-461512840d90	daa1e513-a5e0-4206-86bd-2fa277eab3d0	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
18ad10cf-e954-4383-bcfa-01b5a772d9d3	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5911b524-66fc-4beb-8510-a04c5d670c9d	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
c1403abf-5499-4740-bb26-e35183ef3160	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
20d36b02-4f25-4ceb-8215-77137f131a9e	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
13620a08-07d1-4687-986e-f71f2d6ade69	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	5	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
42e69a22-a3f7-46bc-af3f-ab8b06b1d082	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	6	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
92ba7148-977f-4100-925c-e42b3e1c26b7	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	7	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
f5c0b3ae-654f-42fe-9414-552a17ddbccb	daa1e513-a5e0-4206-86bd-2fa277eab3d0	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	8	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
c051b6d6-2692-476b-8ba5-86da1a689690	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
bc492f25-c747-4776-8f3a-5c68b248c516	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ff9cce14-1624-44ac-8b6a-84cb3bec9493	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
51481fcd-f5b7-4e0f-a70a-2dadd7bd3a13	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
6cf6c5e1-46b3-400d-8f2b-bea70ecf12f2	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
8f90427c-44ef-428e-8062-75b9fa688d8b	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
78c00e40-edc1-4f1e-8a2b-35f18d567038	daa1e513-a5e0-4206-86bd-2fa277eab3d0	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3288804a-ffb5-437f-9428-999e23a28972	08709cdd-7882-4e18-9b0f-70c0c1efa889	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
a143c117-c161-4ce6-994c-977d11a18614	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
c2d50334-c812-4e37-8d15-ac8f8c656a95	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
c9e3717d-83cc-4f67-ae1e-9385206cd9a4	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ea81a57d-f6a7-4427-9e43-75e5ade8d92e	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
7739fbb9-af16-498d-a8aa-c436fb9aec20	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	5	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
02584068-febf-4796-bd27-52116c63ee0b	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	6	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
efbff8e3-35fe-4c57-aa98-059a2b950098	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	7	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
6632930f-3554-4d4b-afa2-74f5aa300bea	08709cdd-7882-4e18-9b0f-70c0c1efa889	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	8	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
8b03c444-5b5e-48d2-8818-d2292fba3e79	08709cdd-7882-4e18-9b0f-70c0c1efa889	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
2afe6557-1b36-4621-bd91-ca3f30d422a4	08709cdd-7882-4e18-9b0f-70c0c1efa889	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
8605776d-bafe-4621-aa3f-aa2e20b9fdfc	08709cdd-7882-4e18-9b0f-70c0c1efa889	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ef557734-b946-47f4-9f85-10807d787d70	08709cdd-7882-4e18-9b0f-70c0c1efa889	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
dc3f3cb0-f72c-415e-bef2-2a64d080b680	08709cdd-7882-4e18-9b0f-70c0c1efa889	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
d017ae24-411e-4dd4-8b50-8efb2d068bf4	08709cdd-7882-4e18-9b0f-70c0c1efa889	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
53a3c93e-8d13-44f7-a695-1ea8a43259d0	08709cdd-7882-4e18-9b0f-70c0c1efa889	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
bd9a4794-d8f1-4880-92da-8f55e4323050	3ecc113e-20a8-4c70-9608-b47ad56d0079	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
7ea1dc49-f7d7-4fcc-87ff-d33855a6114d	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
bc0d4505-f684-4eae-948a-148faa7166a0	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
f8b3e4e1-3ef7-40c7-af39-4b6069235ac8	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
b8d85b96-d4a4-47c4-82f6-e69575d5e801	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ac40c32e-5f8a-4c73-a1ac-a9d22187a75b	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	5	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
9a320556-5607-4f28-9ce3-1310fb5067d6	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	6	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
60ec8546-542d-4b17-a5bd-0d57ccbbd727	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	7	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
f40c5b02-321c-45f8-a28c-d03f4e66415e	3ecc113e-20a8-4c70-9608-b47ad56d0079	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	8	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5b76c619-ca37-4e5e-9f3f-7c9255f58222	3ecc113e-20a8-4c70-9608-b47ad56d0079	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
329dbcd1-4208-4bb5-843e-b1cb1da799d2	3ecc113e-20a8-4c70-9608-b47ad56d0079	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
f512a647-066e-4626-9547-6c2f25dafc34	3ecc113e-20a8-4c70-9608-b47ad56d0079	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
addf3011-b1f5-4ef6-a551-4148484c44a8	3ecc113e-20a8-4c70-9608-b47ad56d0079	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
77271bf0-56a2-4d01-bcd8-3d255340c49b	3ecc113e-20a8-4c70-9608-b47ad56d0079	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
964f4597-6164-4313-8b49-26fc17f45697	3ecc113e-20a8-4c70-9608-b47ad56d0079	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
fe53bc51-9488-4293-9c26-508fd827eb07	3ecc113e-20a8-4c70-9608-b47ad56d0079	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
90fd1590-3d91-4624-b7f1-944a27c172ad	3cd79f71-bb2c-49de-b0f4-da603ca913b3	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
9aa99909-111f-4290-9979-f6b3888a78b0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
fd45d0d8-03f9-4526-aae4-b567586ade74	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
15c272fd-57be-4cfc-8790-9eeed6604b74	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
6ca36f9f-b8da-4ac7-bac6-8410ce6bf255	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
adc9fc24-82be-411c-8040-04b1af48bf77	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	5	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
f4103c47-80da-42c6-88d2-51e9985ad590	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	6	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
a2e2c536-8c59-4dff-b94b-9dc9a704f1f3	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	7	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
1a8769e0-d3c4-48cd-a7dd-4fa7195f4d61	3cd79f71-bb2c-49de-b0f4-da603ca913b3	05ac1a73-1ee2-474c-b825-4cd56f49398b	Heat	8	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ce6078e7-61f4-4657-803c-cec402fc0f8a	3cd79f71-bb2c-49de-b0f4-da603ca913b3	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3c7c3265-1bfb-4997-9488-ea42a2989cd5	3cd79f71-bb2c-49de-b0f4-da603ca913b3	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
69888db5-0d36-46cd-9d7a-2b6eea6692f5	3cd79f71-bb2c-49de-b0f4-da603ca913b3	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3dd2b601-69bd-4687-b14c-0b0386346f0e	3cd79f71-bb2c-49de-b0f4-da603ca913b3	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
653c5690-866f-47c1-aa34-6e7c3d21ed9a	fdb36615-d7b0-4b83-8189-1cf03abbc692	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
202b8b49-ac31-47a9-9ada-808c41464c64	fdb36615-d7b0-4b83-8189-1cf03abbc692	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
7696c493-7d1b-4f3a-82fe-9d60aff61406	fdb36615-d7b0-4b83-8189-1cf03abbc692	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
6ecabd65-7bcf-4603-815c-2fd2ab12274a	fdb36615-d7b0-4b83-8189-1cf03abbc692	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5eea0a23-27ce-474d-a4e9-aeea238cf8df	fdb36615-d7b0-4b83-8189-1cf03abbc692	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
220e5b84-8c1a-46b0-b71b-682f0591a106	fdb36615-d7b0-4b83-8189-1cf03abbc692	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
52f43b5c-f402-4acc-99f1-b31748a08cc6	fdb36615-d7b0-4b83-8189-1cf03abbc692	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
88aa75dc-04c4-43d1-acb7-11fcfada200f	957369fd-7be7-41fd-97f1-e86c258d2829	17042ce5-3659-4f47-bb48-5e344103858b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
2ff4bdc6-3443-4983-a85c-958fee337ec9	957369fd-7be7-41fd-97f1-e86c258d2829	86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3bc46eab-bc7a-4382-b595-a37e6904de43	957369fd-7be7-41fd-97f1-e86c258d2829	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
7c73979d-ce7d-428e-ab23-1e1d944298a5	957369fd-7be7-41fd-97f1-e86c258d2829	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
3c811c30-12db-40f4-8d5f-c4cd95a0c051	957369fd-7be7-41fd-97f1-e86c258d2829	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	3	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
675f201f-b645-4535-9215-f8c29263c953	957369fd-7be7-41fd-97f1-e86c258d2829	4a2922e1-5c33-4f1d-be15-6968eab54ca9	Heat	4	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
08c3fff9-b9d1-48f0-883e-4772e3ef6115	957369fd-7be7-41fd-97f1-e86c258d2829	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5c501594-af9b-4101-9994-65cc18c37ba9	957369fd-7be7-41fd-97f1-e86c258d2829	a9e50421-3d73-4262-87bf-d81e3aab3e40	Heat	2	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
9eb5758e-195f-45be-a0cd-8314ec892420	957369fd-7be7-41fd-97f1-e86c258d2829	a9094671-2922-49ef-bf2a-65e82347847c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
ec2c331b-bfe9-454f-8094-587242339abf	957369fd-7be7-41fd-97f1-e86c258d2829	93606461-741f-4490-ae3b-8e32cbccd21c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
6ccda3fb-7cfe-4931-a697-b2fd05a1db11	957369fd-7be7-41fd-97f1-e86c258d2829	3c27eb8d-d90e-4b33-8575-0ea901b0846b	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
9d7ddd7d-37b8-4ac8-a806-cf872f50f611	957369fd-7be7-41fd-97f1-e86c258d2829	7822840f-9c27-41fe-bfa5-ae860943f33c	Heat	1	3	\N	\N	f	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
40696ad5-ee9a-4f8e-b917-6501907e4754	1433c190-f1ad-40e2-adf2-6f900f7eea91	f81f1890-fd94-49bb-a3d4-cf165662bd63	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
0bd115de-87a8-4bfb-aacf-f6a23250c400	1433c190-f1ad-40e2-adf2-6f900f7eea91	f81f1890-fd94-49bb-a3d4-cf165662bd63	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
5a1e6353-b667-44e1-bc3e-af910514bd6d	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	1	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
2da369db-af10-4d00-b00a-e2d0f5c036d1	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	2	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
b315136e-52e8-4fbb-909a-f8017f028766	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	3	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
e6f9d503-5816-4cef-8bb5-ed3293e326a7	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	4	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
a544f40a-4712-4c78-8de0-e3b6caed56b0	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	5	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
fd994f6d-85be-4188-958d-f2c08f357df9	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	6	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
97dbeda9-0ab1-46ce-bda8-8bcd476f97be	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	7	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
72e0df33-d65b-45f8-88af-a9725dd8cfac	1433c190-f1ad-40e2-adf2-6f900f7eea91	6c1bc773-77f7-4d48-822d-d119aabcddf2	Heat	8	2	\N	\N	t	t	f	2022-08-02 09:42:37.822176+00	2022-08-02 09:42:37.822176+00	f	\N
\.


--
-- TOC entry 3196 (class 0 OID 19506)
-- Dependencies: 282
-- Data for Name: rounds; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx.rounds (id, name, "roundNo", "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
ac5a9f87-fa9d-4c1d-a248-4fb6128022dc	Timed Practice	1	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
f81f1890-fd94-49bb-a3d4-cf165662bd63	Battle Qualifying	2	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
6c1bc773-77f7-4d48-822d-d119aabcddf2	Battle Round 1	3	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
86720f22-fa6b-4fa3-b691-eb7ad6862fe1	Free Practice 2	1	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
05ac1a73-1ee2-474c-b825-4cd56f49398b	Battle Round 1	2	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
4a2922e1-5c33-4f1d-be15-6968eab54ca9	Battle Round 2	3	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
a9e50421-3d73-4262-87bf-d81e3aab3e40	Battle Round 3	4	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
a9094671-2922-49ef-bf2a-65e82347847c	Battle Round 4	5	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
17042ce5-3659-4f47-bb48-5e344103858b	Free Practice 1	1	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
93606461-741f-4490-ae3b-8e32cbccd21c	Heat 1	6	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
3c27eb8d-d90e-4b33-8575-0ea901b0846b	Last Chance Qualifier	8	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
7822840f-9c27-41fe-bfa5-ae860943f33c	Final	9	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
26a5b26f-e0cf-48b4-99d3-3dcc8b13e5a1	Heat 1	7	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
bb7bfd2a-922a-4e71-97a4-a1b9a0815142	Battle Round 2	4	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
4b496d6e-0df9-4c10-8751-68538cc421c6	Battle Round 3	5	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
8cc07e8c-7eb1-4312-ab39-1aee7f79ad8b	Battle Round 4	6	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
5de150a2-605d-42ee-811f-1a2bb6ef47c7	Round 1	7	t	f	2022-09-08 09:48:27.636748+00	2022-09-08 09:48:27.636748+00
366d5d10-e54c-442b-b555-dc354f445cf6	Semifinal	8	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
f3299bb1-5824-4697-971f-3190a46891cb	Last Chance Qualifier	9	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
2fe05eb0-3188-4ebb-8ec8-1303669ef859	Final	10	t	f	2022-08-02 09:42:14.234284+00	2022-08-02 09:42:14.234284+00
\.


--
-- TOC entry 3203 (class 0 OID 19641)
-- Dependencies: 289
-- Data for Name: scores; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx.scores (id, "eventId", "roundHeatId", "athleteId", "roundSeed", "lapTime", "jokerLapTime", "heatPosition", notes, "isActive", "isArchived", "createdAt", "updatedAt", "lapNumber", "isJoker", "isBye", status) FROM stdin;
5e20b527-8ad2-4db1-a9b3-160946c810c2	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c26667c0-6f98-4cab-8ca0-8f3d50ce546d	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
e220e191-36b4-452f-927a-866972be2353	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
ec2a9fc3-fe16-49c8-a957-25f9c6909524	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
1d24ccd2-89b2-463f-af4a-1f5169d50819	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
2e90a47b-dbfb-4536-aecb-ff887020b162	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
ebd56217-a58b-4e1c-af60-295688eb0de8	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
929441d4-21de-483f-bb54-ab8a57e9db74	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
248c2679-8d04-4a59-b556-ae998c78558a	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
f0d08abe-c702-4dfa-8338-9e638b4ef975	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
8de52f1a-3e85-4ebd-9c8a-52220ca0ff34	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	63.18	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
993e5be1-5293-4ad0-bb07-504d65032604	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	84.777	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
80c46729-d2ac-4e57-8007-144e1890d42b	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
9faee338-3eb1-451d-9e33-c6a365399f9b	daa1e513-a5e0-4206-86bd-2fa277eab3d0	4c3059c6-c4bf-4c31-8307-461512840d90	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
4f9e38fa-2799-47b0-991b-05eeb37d3b63	daa1e513-a5e0-4206-86bd-2fa277eab3d0	18ad10cf-e954-4383-bcfa-01b5a772d9d3	95d3b712-09f7-4750-88ae-376680c67a8a	0	61.07	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	t	\N
2ba15d98-3049-498e-bfcb-b25dba3394cf	daa1e513-a5e0-4206-86bd-2fa277eab3d0	5911b524-66fc-4beb-8510-a04c5d670c9d	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
592bd7b9-a64e-43fe-84c8-4788ff281641	daa1e513-a5e0-4206-86bd-2fa277eab3d0	5911b524-66fc-4beb-8510-a04c5d670c9d	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	60.945	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
d46ed8fd-999b-4fa7-83da-08bd599f58ff	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c1403abf-5499-4740-bb26-e35183ef3160	34154703-e8e1-4857-b50c-5ca928631056	0	65.844	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
25a827ec-5ddd-4e3b-89d2-51fe3753563a	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c1403abf-5499-4740-bb26-e35183ef3160	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	60.954	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
426a12ac-0c02-455c-93f0-648744e367ea	daa1e513-a5e0-4206-86bd-2fa277eab3d0	20d36b02-4f25-4ceb-8215-77137f131a9e	aa538b11-123d-4ce6-a85f-1954d88dca71	0	60.395	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
2695caaf-605c-4255-b848-b9af0f85c436	daa1e513-a5e0-4206-86bd-2fa277eab3d0	20d36b02-4f25-4ceb-8215-77137f131a9e	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	60.742	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
0fcb774d-37ee-45c3-a3a5-359860a5696e	daa1e513-a5e0-4206-86bd-2fa277eab3d0	13620a08-07d1-4687-986e-f71f2d6ade69	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	t	\N
c1e75f97-7e0d-4c42-a540-d8f861800957	daa1e513-a5e0-4206-86bd-2fa277eab3d0	42e69a22-a3f7-46bc-af3f-ab8b06b1d082	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	60.715	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
21b5305f-8b9a-42e5-8ffd-68f9e8b53c65	daa1e513-a5e0-4206-86bd-2fa277eab3d0	42e69a22-a3f7-46bc-af3f-ab8b06b1d082	50c728b4-196e-4a63-8406-6031609368ed	0	69.824	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
08e11f5b-4c23-4447-981c-e493dcc1c7f8	daa1e513-a5e0-4206-86bd-2fa277eab3d0	92ba7148-977f-4100-925c-e42b3e1c26b7	7c1753ff-f867-44df-8052-6e634163a215	0	65.524	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
e2eae51c-862f-437f-8ff7-291bc0085d9b	daa1e513-a5e0-4206-86bd-2fa277eab3d0	92ba7148-977f-4100-925c-e42b3e1c26b7	b6288334-84e9-4346-9540-9db9d25ebf18	0	61.602	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
1347f207-d501-4f4b-99bf-3f17ed870173	daa1e513-a5e0-4206-86bd-2fa277eab3d0	f5c0b3ae-654f-42fe-9414-552a17ddbccb	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	67.715	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
027f2aac-b12b-4263-906b-1ce42cc35237	daa1e513-a5e0-4206-86bd-2fa277eab3d0	f5c0b3ae-654f-42fe-9414-552a17ddbccb	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
f62145c0-f33c-4dcc-8445-8cdf175576e6	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	7d302c30-4506-41a2-9eca-43e47ce03631	1	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
8f09ed01-bd87-45dc-9feb-440dc5f434c2	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	c98215ca-b233-49f6-a9f3-3dd0e34c1011	2	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
fa5e18ee-e8d8-457a-ad7c-754173082a33	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	95d3b712-09f7-4750-88ae-376680c67a8a	3	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
76b5b38d-92c2-4e38-9a19-cc8119a3cf82	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	93ca2b38-7487-4e9a-b57a-98cf962050b9	4	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
949d5433-1c7b-407e-9fd1-c05850c93aad	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	aa538b11-123d-4ce6-a85f-1954d88dca71	5	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
2df659c3-9118-41e1-a576-fe1001127546	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	34154703-e8e1-4857-b50c-5ca928631056	6	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
5219f973-f7b8-4584-a98c-1abe1de2cac7	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	368ba3e3-7b6d-4a4d-95ab-af081466c45a	7	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
2fcefa37-f74a-4da3-a69b-2f20cb456d39	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	50c728b4-196e-4a63-8406-6031609368ed	8	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
749d0d86-265f-48a1-a752-6032587b3086	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c051b6d6-2692-476b-8ba5-86da1a689690	7d302c30-4506-41a2-9eca-43e47ce03631	0	65.668	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
e19c6073-0275-4869-bd4c-8750aa229026	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	7c1753ff-f867-44df-8052-6e634163a215	9	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
a7e119da-4ddd-4e2c-92ee-10c694d9d634	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	a72fd561-0a12-47ba-8d4b-35bfade8497c	10	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
ae53d14d-8cf4-4194-89ed-fbc201a21afe	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	b6288334-84e9-4346-9540-9db9d25ebf18	11	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
e441be07-5db6-45a3-aa86-1afd642a3b51	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	12	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
278e5d6b-2032-4dea-950c-164cf657215c	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	3555ad6e-4378-4820-b377-30e28434a65f	13	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
6a993d66-951a-4135-abb3-61b01769a4ab	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	4db9c2e5-9eda-40b7-8250-71ecfa73b13a	14	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
f862cc7c-d958-4bb2-9927-77db9983dd8b	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	15	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
b565c36e-1c37-418a-b10f-7e1a4018f296	daa1e513-a5e0-4206-86bd-2fa277eab3d0	c051b6d6-2692-476b-8ba5-86da1a689690	95d3b712-09f7-4750-88ae-376680c67a8a	0	172.656	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
9f2fc712-6859-47c1-9438-a3ad03d5c5b9	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	b9e90030-eec1-4140-b55d-cb558b60ca6c	16	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
8277f454-b7ef-4954-adab-c691a0615ecc	1433c190-f1ad-40e2-adf2-6f900f7eea91	66057dde-fcf3-4a50-89af-dc4b1d5c85a8	c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	17	\N	\N	\N	\N	t	f	2022-08-02 18:07:09.495714+00	2022-08-02 18:07:09.495714+00	1	f	f	\N
f2472671-0e1e-451a-8993-6ca7ba473a39	daa1e513-a5e0-4206-86bd-2fa277eab3d0	bc492f25-c747-4776-8f3a-5c68b248c516	aa538b11-123d-4ce6-a85f-1954d88dca71	0	61.312	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
5e1b57ed-d571-43ff-a92a-4f503156a605	daa1e513-a5e0-4206-86bd-2fa277eab3d0	bc492f25-c747-4776-8f3a-5c68b248c516	34154703-e8e1-4857-b50c-5ca928631056	0	66.856	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
132226bf-e1b2-4184-95e0-6fb8b8bd3999	daa1e513-a5e0-4206-86bd-2fa277eab3d0	ff9cce14-1624-44ac-8b6a-84cb3bec9493	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	60.164	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
aa23c0a7-1a19-4803-8956-b2de1e8caf9e	daa1e513-a5e0-4206-86bd-2fa277eab3d0	ff9cce14-1624-44ac-8b6a-84cb3bec9493	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	66.808	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
a1c0e36f-fdf5-4aab-b22e-fedcdaf0a532	daa1e513-a5e0-4206-86bd-2fa277eab3d0	51481fcd-f5b7-4e0f-a70a-2dadd7bd3a13	7c1753ff-f867-44df-8052-6e634163a215	0	60.461	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
96027e43-cc09-4e10-9a8e-ccc3e2c8ef51	daa1e513-a5e0-4206-86bd-2fa277eab3d0	51481fcd-f5b7-4e0f-a70a-2dadd7bd3a13	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
8749fdbc-00e4-44f4-b935-f9f345ff25c6	daa1e513-a5e0-4206-86bd-2fa277eab3d0	6cf6c5e1-46b3-400d-8f2b-bea70ecf12f2	7d302c30-4506-41a2-9eca-43e47ce03631	0	63.43	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
cc122d9d-4769-4dd0-b472-e8e8f4d1287e	daa1e513-a5e0-4206-86bd-2fa277eab3d0	6cf6c5e1-46b3-400d-8f2b-bea70ecf12f2	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
c3f53bac-6f6c-4565-b3c7-cb62e9e1c01a	daa1e513-a5e0-4206-86bd-2fa277eab3d0	8f90427c-44ef-428e-8062-75b9fa688d8b	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	63.695	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
76455c2e-bcef-4edf-8320-7d63034751b9	daa1e513-a5e0-4206-86bd-2fa277eab3d0	8f90427c-44ef-428e-8062-75b9fa688d8b	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
d2a98b2f-8daa-4169-a5ae-828fe286f100	daa1e513-a5e0-4206-86bd-2fa277eab3d0	78c00e40-edc1-4f1e-8a2b-35f18d567038	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	64.422	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
3ed63471-7e39-4c12-a0aa-e4c23f5109b4	daa1e513-a5e0-4206-86bd-2fa277eab3d0	78c00e40-edc1-4f1e-8a2b-35f18d567038	7d302c30-4506-41a2-9eca-43e47ce03631	0	64.957	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
731b5696-b38b-4a95-a70c-56f22518fb2f	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c73abdff-b094-4fb1-9622-7fd7ecde2b30	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
29b373e3-fb0a-4c24-b639-134ef31cc765	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
78eb4be6-536b-46cf-86b5-a2bd90f72a35	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
ad308e4a-80aa-4b53-812b-8620ca2cab2f	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
70a15f7d-9406-4af2-8bcc-c3b5af000b21	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
6ffa61d2-dc0b-43fd-9e79-b67e268db8fa	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
dcd4f5b7-7b57-4fe0-87fe-326a73d9d9ff	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c7f6f93f-0a46-45be-9914-29670e0f4ea1	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
6f24496e-0391-480c-9ee5-126167f1a42f	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c8c2640a-e470-4f89-a7f5-dda3f7aab006	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
f807b2b4-0912-4c99-b2dd-28fd6f1d59f9	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
9f7e7222-96e9-4a02-92c7-56a24f44b626	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c28d9a28-8421-4e9a-b006-bc2929c8fef3	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
0fa2cda4-7806-4a59-99f9-30e1bc50fb7c	08709cdd-7882-4e18-9b0f-70c0c1efa889	3288804a-ffb5-437f-9428-999e23a28972	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
581f96b0-6a77-4f45-b588-2e38f3d7ecc3	08709cdd-7882-4e18-9b0f-70c0c1efa889	a143c117-c161-4ce6-994c-977d11a18614	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	t	\N
29baa306-10da-4063-bf82-ad89288a6c52	08709cdd-7882-4e18-9b0f-70c0c1efa889	c2d50334-c812-4e37-8d15-ac8f8c656a95	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
51ccf55c-c98e-44ab-ae70-28f36bca35e6	08709cdd-7882-4e18-9b0f-70c0c1efa889	c2d50334-c812-4e37-8d15-ac8f8c656a95	c7daa7dd-c0cc-41bf-9e64-7a4ba2189122	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
809afd68-5a4a-4fbb-9bb1-9c1a2b1048e7	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	1	59.909	\N	1	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
f938c617-9884-4282-af1b-c5cbdcc8b801	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	1	72.191	\N	1	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
9b039fcb-2559-4352-9e68-e79bd62cf8b3	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	1	61.014	\N	1	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
b976296d-f5fe-496a-a538-c8988676174f	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7d302c30-4506-41a2-9eca-43e47ce03631	2	62.733	\N	2	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
202f6c0e-c34d-4f2a-bb4f-4cf5182c8b22	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7d302c30-4506-41a2-9eca-43e47ce03631	2	72.255	\N	2	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
5085b3c4-fbde-4972-ac9c-143bc418b065	08709cdd-7882-4e18-9b0f-70c0c1efa889	c9e3717d-83cc-4f67-ae1e-9385206cd9a4	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
1616d461-826a-4847-aec3-41f23da008f3	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7d302c30-4506-41a2-9eca-43e47ce03631	2	60.991	\N	2	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
1e569fd9-150c-498e-afe1-d65c043c008f	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	74.128	\N	3	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
cd3495b8-4e6a-4698-ae75-5341ab31b631	08709cdd-7882-4e18-9b0f-70c0c1efa889	c9e3717d-83cc-4f67-ae1e-9385206cd9a4	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
ea65cf02-5bf3-4b4f-b80c-4c9cef7016db	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	61.038	\N	3	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
91ea92c6-f5b6-46c1-b80b-22d9a8ad3d3b	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	\N	\N	3	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
bf839fd9-cf93-48a2-b885-56b8a80cb49a	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	62.221	\N	4	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
8f3574d9-2684-426d-923e-59caeb6d270b	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	72.079	\N	4	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
92448a0c-7463-4fa4-8830-0d1c9010b547	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	61.058	\N	4	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
39de3823-7b79-454c-9e1e-0729564fe4c3	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	50c728b4-196e-4a63-8406-6031609368ed	5	73.874	\N	5	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
684f3394-9f30-4e98-bc3d-cff29efd4c23	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	50c728b4-196e-4a63-8406-6031609368ed	5	61.095	\N	5	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
1eb5a1ae-89ab-4f73-8b76-959640e45cc0	08709cdd-7882-4e18-9b0f-70c0c1efa889	ea81a57d-f6a7-4427-9e43-75e5ade8d92e	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
839bceb0-66dd-42d6-ab77-096b7fdae488	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	50c728b4-196e-4a63-8406-6031609368ed	5	\N	\N	5	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
9cd708cf-d05e-4abb-a195-eb7c82e5f9eb	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	8bd83a59-ffa6-4a99-9d9c-d258abe64802	6	74.353	\N	6	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
3a711e1e-1061-4c9a-8385-7c6a4092d498	08709cdd-7882-4e18-9b0f-70c0c1efa889	ea81a57d-f6a7-4427-9e43-75e5ade8d92e	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
e6172f25-319f-41e4-b161-1008a644cd23	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	8bd83a59-ffa6-4a99-9d9c-d258abe64802	6	61.118	\N	6	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
c305bd06-507e-46ce-8266-9617c08a73b4	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	8bd83a59-ffa6-4a99-9d9c-d258abe64802	6	\N	\N	6	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
aac31485-b944-44cd-90c5-ab6b8e75d4c6	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	42dd513a-7a48-4389-a17d-d78aadce80c3	7	62.111	\N	7	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
427cc7cf-717c-49c9-ac7c-8379ec9ba505	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	42dd513a-7a48-4389-a17d-d78aadce80c3	7	71.759	\N	7	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
ccc6dff7-1b2b-4194-a2a3-41446cee3cd7	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	42dd513a-7a48-4389-a17d-d78aadce80c3	7	61.134	\N	7	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
6194884b-c686-4da4-a6b2-61524ea2c83c	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	394e070d-2570-48e2-90ba-a2622a8b4925	8	63.109	\N	8	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
1a54fe4a-d7e3-46b2-85ed-9f34b6855d1d	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	394e070d-2570-48e2-90ba-a2622a8b4925	8	70.11	\N	8	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
d12f9ef3-dd70-436f-8cc6-725dd1cb706f	08709cdd-7882-4e18-9b0f-70c0c1efa889	7739fbb9-af16-498d-a8aa-c436fb9aec20	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
fa94266b-09d2-431b-86fc-faaf4d842f16	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	394e070d-2570-48e2-90ba-a2622a8b4925	8	61.174	\N	8	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
d7c4a066-59fb-464d-822f-349d875ff121	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	9	73.654	\N	9	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
687a9745-7a6a-406b-9cac-4a46a05a6ce3	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	9	61.295	\N	9	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
0f1b48f8-4d43-4f5f-b921-6dbdc16ab3c4	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	9	\N	\N	9	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
f8586bc9-9ba2-45fc-88ef-2f50bc5940a2	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	a4452a78-f47d-4ddd-bc45-e59b916afdf8	10	73.309	\N	10	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
ab7f5b8e-dc1d-4a03-b86d-b2478a034aa8	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	a4452a78-f47d-4ddd-bc45-e59b916afdf8	10	65.665	\N	10	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
1a36b90f-a7a7-408b-b483-b3d73fb422b0	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	a4452a78-f47d-4ddd-bc45-e59b916afdf8	10	\N	\N	10	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
2b3c2f9f-0f19-4ed1-969e-00f9c59d19f1	08709cdd-7882-4e18-9b0f-70c0c1efa889	7739fbb9-af16-498d-a8aa-c436fb9aec20	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
7342aa01-2de0-4d33-ad3b-ca4a9fd3535a	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7c7385f1-259e-4e9b-bed3-031a2ed5041c	11	72.933	\N	11	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	1	f	f	ACT
babfa9b1-e1d1-4278-a6ab-3826c9cfd183	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7c7385f1-259e-4e9b-bed3-031a2ed5041c	11	66.944	\N	11	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	2	f	f	ACT
f5e7369d-793f-4959-94c5-e56e04c7d9de	dc423d3f-e28e-4913-9343-236c705cb3f2	83b71781-bb93-478f-b235-51d0754740cd	7c7385f1-259e-4e9b-bed3-031a2ed5041c	11	\N	\N	11	\N	t	f	2022-09-08 09:53:03.708541+00	2022-09-08 09:53:03.708541+00	3	f	f	ACT
b27bb5e4-3041-4d0d-a1db-d1839a29a558	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	50c728b4-196e-4a63-8406-6031609368ed	1	39.484	\N	1	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	f	f	ACT
5c186c0e-9def-4e68-bcae-6e64db4f9bcc	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	50c728b4-196e-4a63-8406-6031609368ed	1	48.72	\N	1	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	f	f	ACT
f6606de9-3b46-4c6c-bdec-93070f034e11	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	50c728b4-196e-4a63-8406-6031609368ed	1	55.1	\N	1	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	f	f	ACT
40c49b66-1c79-45d0-a536-f79268109541	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	50c728b4-196e-4a63-8406-6031609368ed	1	47.489	\N	1	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	t	f	ACT
e3807b29-f157-4bb8-b448-e64d6576d253	08709cdd-7882-4e18-9b0f-70c0c1efa889	02584068-febf-4796-bd27-52116c63ee0b	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
de7f7da0-a5f7-4769-963a-d57bb2fbb335	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	39.217	\N	2	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	f	f	ACT
fcac179c-9108-488f-9604-24d7650c5219	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	51.316	\N	2	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	f	f	ACT
70a71b30-bd54-4041-b1df-53fe753f4aef	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	53.399	\N	2	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	f	f	ACT
669b39a3-16ed-4d1b-810c-76ce7d9e1499	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	47.617	\N	2	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	t	f	ACT
7e56fe37-887f-4eed-8426-623695cee4cd	08709cdd-7882-4e18-9b0f-70c0c1efa889	02584068-febf-4796-bd27-52116c63ee0b	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
88e154ce-5fe1-46da-8cef-3e3b34317d0f	08709cdd-7882-4e18-9b0f-70c0c1efa889	efbff8e3-35fe-4c57-aa98-059a2b950098	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
b83f2d0b-85b8-44d6-a0d6-66479ef586c0	08709cdd-7882-4e18-9b0f-70c0c1efa889	efbff8e3-35fe-4c57-aa98-059a2b950098	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
eb1b4c6c-72c7-4b8d-8101-1a611e6883de	08709cdd-7882-4e18-9b0f-70c0c1efa889	6632930f-3554-4d4b-afa2-74f5aa300bea	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
988992cc-62a1-40f0-a567-ef0edaa9dc20	08709cdd-7882-4e18-9b0f-70c0c1efa889	6632930f-3554-4d4b-afa2-74f5aa300bea	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
a059e55e-f6ce-4c37-bb27-769586711bb0	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	40.413	\N	3	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	f	f	ACT
44fbaef0-7a1d-4c57-8ee5-b6e01d9d7f9a	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	51.926	\N	3	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	t	f	ACT
01d21ad4-74e9-4898-a37f-4b9f55cde950	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	56.225	\N	3	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	f	f	ACT
fea543d0-e7e9-41bc-ad7d-1046543f9606	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	43.36	\N	3	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	f	f	ACT
02d206ad-9801-4d4d-84b7-b88faed176cc	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	42dd513a-7a48-4389-a17d-d78aadce80c3	4	43.584	\N	4	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	t	f	ACT
1421f0e2-458a-4632-a799-f78e184be504	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	42dd513a-7a48-4389-a17d-d78aadce80c3	4	51.464	\N	4	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	f	f	ACT
bc9745f7-23d9-44bb-8ebd-c371ea9cd7d6	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	42dd513a-7a48-4389-a17d-d78aadce80c3	4	52.926	\N	4	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	f	f	ACT
cc551e5c-25ea-40dd-b366-35c06f48c8ee	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	42dd513a-7a48-4389-a17d-d78aadce80c3	4	44.223	\N	4	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	f	f	ACT
d9613372-dc61-4c38-b6ff-ca1db5d66b72	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	41.026	\N	5	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	f	f	ACT
00dcdefe-420e-4dd5-a0cf-6ca0f834e47d	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	50.264	\N	5	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	f	f	ACT
0533d225-bc7c-4cbd-b693-97483a6de52e	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	57.383	\N	5	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	t	f	ACT
e200597d-b9bf-48b2-bb5e-abf21fb9e1db	08709cdd-7882-4e18-9b0f-70c0c1efa889	8b03c444-5b5e-48d2-8818-d2292fba3e79	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
035d1e12-241f-4a1f-b22d-9a3b66946f1d	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	45.639	\N	5	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	f	f	ACT
f31b44e2-2e16-46c7-9f39-5375e8d7c151	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	44.76	\N	6	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	1	t	f	ACT
bb4ddedd-f910-4e49-b132-a828e3030b41	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	51.416	\N	6	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	2	f	f	ACT
91978a03-db78-4d1f-a349-c88db23c4b1a	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	53.462	\N	6	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	3	f	f	ACT
1b698777-ff8f-4ce5-96fc-5f2782391ba5	08709cdd-7882-4e18-9b0f-70c0c1efa889	8b03c444-5b5e-48d2-8818-d2292fba3e79	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
e7b9846e-df9c-40d9-9987-716c27c95791	dc423d3f-e28e-4913-9343-236c705cb3f2	2f35730a-4162-4acf-afc6-ea661c8a69b3	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	45.347	\N	6	\N	t	f	2022-09-08 10:03:00.637099+00	2022-09-08 10:03:00.637099+00	4	f	f	ACT
d0b6224b-36bd-4b15-bf75-13f0ac8ddd7c	08709cdd-7882-4e18-9b0f-70c0c1efa889	2afe6557-1b36-4621-bd91-ca3f30d422a4	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
b841fe08-cb7b-4329-a643-9d2c7d646faa	08709cdd-7882-4e18-9b0f-70c0c1efa889	2afe6557-1b36-4621-bd91-ca3f30d422a4	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
eff3fcf0-7b93-4708-8748-590291cb05ea	08709cdd-7882-4e18-9b0f-70c0c1efa889	8605776d-bafe-4621-aa3f-aa2e20b9fdfc	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
9f0a7d88-c1e8-4384-b02f-216817d48551	08709cdd-7882-4e18-9b0f-70c0c1efa889	8605776d-bafe-4621-aa3f-aa2e20b9fdfc	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
25f73613-ee60-4c95-8253-b5df6aea5a16	08709cdd-7882-4e18-9b0f-70c0c1efa889	ef557734-b946-47f4-9f85-10807d787d70	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
1180fbbc-3d33-4307-b65f-2d9ca96fb08a	08709cdd-7882-4e18-9b0f-70c0c1efa889	ef557734-b946-47f4-9f85-10807d787d70	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
06b8370f-2a13-415d-bcaf-898da6073558	08709cdd-7882-4e18-9b0f-70c0c1efa889	dc3f3cb0-f72c-415e-bef2-2a64d080b680	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
66ef36cc-2940-4c53-addc-dbfbad338821	08709cdd-7882-4e18-9b0f-70c0c1efa889	dc3f3cb0-f72c-415e-bef2-2a64d080b680	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
e8eeecf5-52a1-4f28-acb3-9c8dac630671	08709cdd-7882-4e18-9b0f-70c0c1efa889	d017ae24-411e-4dd4-8b50-8efb2d068bf4	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	65.02	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
dbd7b9f9-09af-40c3-8a56-6103da39dd0c	08709cdd-7882-4e18-9b0f-70c0c1efa889	d017ae24-411e-4dd4-8b50-8efb2d068bf4	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
d7d613d5-1aa9-45c9-88a9-ba3ac7bf2cb5	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	40.719	\N	1	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	1	f	f	ACT
08bc5e60-b9ff-485d-9719-3aee65425453	08709cdd-7882-4e18-9b0f-70c0c1efa889	53a3c93e-8d13-44f7-a695-1ea8a43259d0	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	73.625	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
1bfa69b7-91f3-4eda-ab6b-b0e76281ec85	08709cdd-7882-4e18-9b0f-70c0c1efa889	53a3c93e-8d13-44f7-a695-1ea8a43259d0	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
32224b10-9761-400c-9a9f-47185da1b543	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	55.53	\N	1	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	2	f	f	ACT
ccb58e47-6f6a-435d-81d2-a82bb9c7c71f	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	42.509	\N	1	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	3	f	f	ACT
e8d8dd08-d589-4842-af35-96de04a83096	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
3ca7c499-6604-4fea-bac4-5b292fdf6bcb	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
2fdc4083-5d21-4967-aed3-c0aa072d7d4a	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	50.989	\N	1	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	4	t	f	ACT
3da8dd10-ea9d-49f1-96de-8e3aa9270b9c	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	43.905	\N	2	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	1	t	f	ACT
d1f9eb00-3d7f-4b3a-9f6b-545243a7ef2e	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
cbb4bc3c-e216-486e-83f8-12d776b02ab7	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
fc853868-c615-4540-be02-e4d6b356e76f	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	54.734	\N	2	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	2	f	f	ACT
f27fffbe-031d-43e9-a11f-cba77dfe77e7	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	39.237	\N	2	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	3	f	f	ACT
50a4f830-c6fc-4fcf-9b91-af49cfdd3036	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
f53fdad4-5dbc-441b-be53-2c0b3c4ef5ee	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
cabf24a6-1ed8-47ef-8e14-53e526a1d54d	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	50.843	\N	2	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	4	f	f	ACT
832aa2de-934b-412f-9736-4559aa9edb81	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	7d302c30-4506-41a2-9eca-43e47ce03631	3	40.894	\N	3	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	1	f	f	ACT
35bcc4af-e3ed-4922-9a85-86a5cc371fc0	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c3a8a3c1-9b82-40d8-bcf5-c94356a9d337	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
84ba1741-eb6e-4832-8ef8-a865360b6b34	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	7d302c30-4506-41a2-9eca-43e47ce03631	3	58.726	\N	3	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	2	t	f	ACT
2dd75c23-7430-4bf8-a5c0-910d6c8e2b30	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	7d302c30-4506-41a2-9eca-43e47ce03631	3	38.783	\N	3	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	3	f	f	ACT
006fa98a-9aa7-494c-afea-dd8e16a86785	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
87dfd3a1-0f23-4f33-9406-9f0522c78fc4	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
f57148cb-91f7-4a23-be5e-822a97eacff4	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	7d302c30-4506-41a2-9eca-43e47ce03631	3	51.319	\N	3	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	4	f	f	ACT
9ecacc54-0108-43b1-9b66-856880ce9bec	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	394e070d-2570-48e2-90ba-a2622a8b4925	4	40.776	\N	4	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	1	f	f	ACT
325bc1b6-6b5b-4090-aa44-0541d65bc9ab	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	ba60e260-fcf8-465d-9b89-42263911ba92	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
1301cd76-209a-43a3-98b8-7a0c759c32a7	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
264e7391-bd25-448a-b2ed-fc220dfc85fa	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	394e070d-2570-48e2-90ba-a2622a8b4925	4	59.99	\N	4	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	2	t	f	ACT
8c3c9ecb-4996-4efd-ae51-1ac0dadf822b	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	394e070d-2570-48e2-90ba-a2622a8b4925	4	38.808	\N	4	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	3	f	f	ACT
e9df607a-539a-4b38-8458-8d561b1970b8	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	3555ad6e-4378-4820-b377-30e28434a65f	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
ef1fac3d-8615-49a3-bca5-d4b66e254677	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	229.383	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
613903d4-ab70-4457-a418-6fb60a859422	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	394e070d-2570-48e2-90ba-a2622a8b4925	4	52.703	\N	4	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	4	f	f	ACT
b0e74146-5582-4054-9c18-a8806c2af9e5	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	40.641	\N	5	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	1	f	f	ACT
2fd3ef01-2910-4254-922a-1b42882271d5	3ecc113e-20a8-4c70-9608-b47ad56d0079	bd9a4794-d8f1-4880-92da-8f55e4323050	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	300	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
ea13c638-ee2e-4f54-84cd-e7ac2d70df3e	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	55.424	\N	5	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	2	f	f	ACT
34682920-8064-4b97-88cd-825909feb9ef	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	42.926	\N	5	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	3	t	f	ACT
ad02a6d5-241a-4678-bc54-0a2d50dcc695	dc423d3f-e28e-4913-9343-236c705cb3f2	b260a745-649f-4d5e-b437-641e1660a63a	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	54.63	\N	5	\N	t	f	2022-09-08 10:06:51.056046+00	2022-09-08 10:06:51.056046+00	4	f	f	ACT
c6441d32-de8e-41b3-86e9-3d4bdcdcd4c8	3ecc113e-20a8-4c70-9608-b47ad56d0079	7ea1dc49-f7d7-4fcc-87ff-d33855a6114d	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	68.706	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	t	\N
080c7df5-a9bd-4a63-ba74-f21d0ca7e501	3ecc113e-20a8-4c70-9608-b47ad56d0079	bc0d4505-f684-4eae-948a-148faa7166a0	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
b1ca91e5-80c0-44e6-b316-7218c399ad2c	3ecc113e-20a8-4c70-9608-b47ad56d0079	bc0d4505-f684-4eae-948a-148faa7166a0	ba60e260-fcf8-465d-9b89-42263911ba92	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
7b3061b2-8dc3-4fad-bb88-3e6ba8ab5879	3ecc113e-20a8-4c70-9608-b47ad56d0079	f8b3e4e1-3ef7-40c7-af39-4b6069235ac8	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
b191b1a4-6103-4b57-9706-28faa9e5e17b	3ecc113e-20a8-4c70-9608-b47ad56d0079	f8b3e4e1-3ef7-40c7-af39-4b6069235ac8	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
fd0e5a47-9f7a-49a9-a251-35f141b0a7f7	3ecc113e-20a8-4c70-9608-b47ad56d0079	b8d85b96-d4a4-47c4-82f6-e69575d5e801	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
077a24cc-0698-4af0-8aac-323600b6a1b5	3ecc113e-20a8-4c70-9608-b47ad56d0079	b8d85b96-d4a4-47c4-82f6-e69575d5e801	3555ad6e-4378-4820-b377-30e28434a65f	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
63c30e4e-8162-48f3-b4f3-2d1fb578e5d4	3ecc113e-20a8-4c70-9608-b47ad56d0079	ac40c32e-5f8a-4c73-a1ac-a9d22187a75b	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
eebfd2dc-8798-4fd0-8ea3-f54d45c7d9fd	dc423d3f-e28e-4913-9343-236c705cb3f2	9aab7309-331f-417f-a359-17fea37b906d	50c728b4-196e-4a63-8406-6031609368ed	1	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	t	BYE
05e2db92-2d68-471e-8b4d-af0d891e17fb	dc423d3f-e28e-4913-9343-236c705cb3f2	9aab7309-331f-417f-a359-17fea37b906d	50c728b4-196e-4a63-8406-6031609368ed	1	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	t	BYE
39553c2f-279b-4c04-aaca-367123819fd0	dc423d3f-e28e-4913-9343-236c705cb3f2	9aab7309-331f-417f-a359-17fea37b906d	50c728b4-196e-4a63-8406-6031609368ed	1	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	t	BYE
d56dc884-71e4-4970-9556-edcc19322863	dc423d3f-e28e-4913-9343-236c705cb3f2	63216b20-c826-4c50-b4ee-b6402bcaeb5b	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	t	BYE
b5c7df4a-9c1c-4133-8849-7fc9ab6c7931	dc423d3f-e28e-4913-9343-236c705cb3f2	63216b20-c826-4c50-b4ee-b6402bcaeb5b	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	t	BYE
2833432c-6716-41cc-9d93-7278302122c4	dc423d3f-e28e-4913-9343-236c705cb3f2	63216b20-c826-4c50-b4ee-b6402bcaeb5b	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	t	BYE
65a8b881-7447-490b-8573-95e76400bd86	dc423d3f-e28e-4913-9343-236c705cb3f2	251e9167-a36f-47d5-a962-a2f3c35e441e	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	t	BYE
cf5888bb-c7db-42f4-b782-c3d630f700d1	dc423d3f-e28e-4913-9343-236c705cb3f2	251e9167-a36f-47d5-a962-a2f3c35e441e	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	t	BYE
616ea1c6-9f2c-497a-90fa-a665639a07c0	dc423d3f-e28e-4913-9343-236c705cb3f2	251e9167-a36f-47d5-a962-a2f3c35e441e	368ba3e3-7b6d-4a4d-95ab-af081466c45a	3	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	t	BYE
acb9175a-a1b1-421c-91bd-ef7c9265b49a	dc423d3f-e28e-4913-9343-236c705cb3f2	bdc76a4f-af75-46dd-a4f2-3aeb55c2c914	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	t	BYE
ae2bcb7e-196c-4062-9da3-1214270ac67b	dc423d3f-e28e-4913-9343-236c705cb3f2	bdc76a4f-af75-46dd-a4f2-3aeb55c2c914	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	t	BYE
8d790250-ed71-4179-bb69-3c2129337136	dc423d3f-e28e-4913-9343-236c705cb3f2	bdc76a4f-af75-46dd-a4f2-3aeb55c2c914	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	4	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	t	BYE
7e072865-0945-4aeb-832e-5381176eb677	dc423d3f-e28e-4913-9343-236c705cb3f2	1c7cae27-3c1b-411e-b75a-5bb0cc0bebf1	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	5	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	t	BYE
511e3849-b732-45dc-9746-63b249627321	dc423d3f-e28e-4913-9343-236c705cb3f2	1c7cae27-3c1b-411e-b75a-5bb0cc0bebf1	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	5	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	t	BYE
83751461-6f82-4215-8f2e-a10b38923bf2	3ecc113e-20a8-4c70-9608-b47ad56d0079	ac40c32e-5f8a-4c73-a1ac-a9d22187a75b	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
142ff9c4-826b-4514-b152-b21173fb5c4f	dc423d3f-e28e-4913-9343-236c705cb3f2	1c7cae27-3c1b-411e-b75a-5bb0cc0bebf1	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	5	\N	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	t	BYE
46b731f3-5a4c-418a-a8e9-3b991dd0c6d1	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	43.455	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
1ac9a30c-6c94-4d2d-bc29-281fcca9fa38	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	49.653	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
cfaa334d-5448-48af-9636-15171f9a4934	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	43.24	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
5d19abb9-8f8d-4f42-8e9c-b5ad7c7d56c2	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	7d302c30-4506-41a2-9eca-43e47ce03631	7	43.312	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
ab6e07d0-6e96-4aa0-9b90-6795cb84a3c1	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	7d302c30-4506-41a2-9eca-43e47ce03631	7	47.252	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
20b010de-3766-4902-9ead-704e028ab622	dc423d3f-e28e-4913-9343-236c705cb3f2	16f93d9e-c888-4f4c-95d7-95c1952575ae	7d302c30-4506-41a2-9eca-43e47ce03631	7	44.951	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
bf446771-5bb3-40ab-be4a-d059f9af435e	3ecc113e-20a8-4c70-9608-b47ad56d0079	9a320556-5607-4f28-9ce3-1310fb5067d6	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
4c22b5be-57c8-4d94-b033-344b24426f83	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	a4452a78-f47d-4ddd-bc45-e59b916afdf8	8	35.784	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
4042c7a6-fa00-4605-b4fb-a438bd97c973	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	a4452a78-f47d-4ddd-bc45-e59b916afdf8	8	36.136	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
f86e9848-706f-41cd-bb04-7d756ab81b3f	3ecc113e-20a8-4c70-9608-b47ad56d0079	9a320556-5607-4f28-9ce3-1310fb5067d6	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
5432ee55-5050-47a1-8daf-ec751985e1c7	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	a4452a78-f47d-4ddd-bc45-e59b916afdf8	8	39.095	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
588fde23-41e3-486d-ad15-752262a21514	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	42dd513a-7a48-4389-a17d-d78aadce80c3	9	34.185	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
1a3bb925-1374-4902-93bd-a93b13f46ad5	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	42dd513a-7a48-4389-a17d-d78aadce80c3	9	37.335	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
1429166e-e4d5-4372-a992-094f58766736	dc423d3f-e28e-4913-9343-236c705cb3f2	49a8aafa-81b9-4c3b-800a-b962f8f485dc	42dd513a-7a48-4389-a17d-d78aadce80c3	9	39.579	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
6ba266d5-8f24-404f-8322-77658facd6ac	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	7c7385f1-259e-4e9b-bed3-031a2ed5041c	10	42.277	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
30b1d890-fbf1-4e50-bf48-7a9cec299814	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	7c7385f1-259e-4e9b-bed3-031a2ed5041c	10	31.646	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	t	f	ACT
fab37fb4-82bd-4c7d-913c-b8a9911e5d1c	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	7c7385f1-259e-4e9b-bed3-031a2ed5041c	10	31.183	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
8c459ff1-6d6f-4fa4-b6e7-7173c72f9212	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	394e070d-2570-48e2-90ba-a2622a8b4925	11	42.448	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
19d3675a-3bd6-418d-9e4c-237349e42df8	3ecc113e-20a8-4c70-9608-b47ad56d0079	60ec8546-542d-4b17-a5bd-0d57ccbbd727	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
a473769b-035b-4c55-accf-49be341ae05b	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	394e070d-2570-48e2-90ba-a2622a8b4925	11	30.998	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
2b922a36-29a3-4fb5-a7dd-c22efb7b93c3	dc423d3f-e28e-4913-9343-236c705cb3f2	4619db71-3c14-4a87-876a-c4bb97ad68d2	394e070d-2570-48e2-90ba-a2622a8b4925	11	30.471	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
32773669-a137-4492-8509-e97923867047	3ecc113e-20a8-4c70-9608-b47ad56d0079	60ec8546-542d-4b17-a5bd-0d57ccbbd727	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
9b68f12e-2849-4988-b8b1-1fe12f35273e	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	50c728b4-196e-4a63-8406-6031609368ed	12	38.152	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
cab91d8c-bb81-4aa1-a151-f92553fc84da	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	50c728b4-196e-4a63-8406-6031609368ed	12	41.36	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
34ed8573-4b75-4e47-a0b0-51bce5a882f1	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	50c728b4-196e-4a63-8406-6031609368ed	12	34.726	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
68a3154e-a785-42f8-8995-3c6674887239	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	394e070d-2570-48e2-90ba-a2622a8b4925	13	41.077	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
f9e5e035-12cc-40f0-8cee-a90fb391ffa0	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	394e070d-2570-48e2-90ba-a2622a8b4925	13	39.2	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
731c0d95-fae6-4278-8f9b-95fe087029fd	dc423d3f-e28e-4913-9343-236c705cb3f2	1317a876-b03b-48ae-94ad-c916a8954cf9	394e070d-2570-48e2-90ba-a2622a8b4925	13	34.408	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
8d9df697-55b0-40d0-aa6d-3fe5d4f54018	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	8bd83a59-ffa6-4a99-9d9c-d258abe64802	14	34.141	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
a3d96cd7-6468-4773-8023-40e22250e3d8	3ecc113e-20a8-4c70-9608-b47ad56d0079	f40c5b02-321c-45f8-a28c-d03f4e66415e	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
a54b7cc8-1968-40fd-a3c2-1a71608f6799	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	8bd83a59-ffa6-4a99-9d9c-d258abe64802	14	34.778	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
72cd9331-2ee2-4532-bd58-39f103ef5770	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	8bd83a59-ffa6-4a99-9d9c-d258abe64802	14	36.093	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
b34d5ac4-60a0-4e95-be9a-3854673b001a	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	42dd513a-7a48-4389-a17d-d78aadce80c3	15	37.216	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
100e464c-349c-4aeb-80d1-bf38353be6ee	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	42dd513a-7a48-4389-a17d-d78aadce80c3	15	38.432	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
6f5a743c-cb32-4cd8-a206-acec24cafbb5	dc423d3f-e28e-4913-9343-236c705cb3f2	1850b65d-3e30-4247-b1f1-e0a2af939784	42dd513a-7a48-4389-a17d-d78aadce80c3	15	36.422	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
583c9768-2004-4e5f-b676-e9bdac2b0ed2	3ecc113e-20a8-4c70-9608-b47ad56d0079	f40c5b02-321c-45f8-a28c-d03f4e66415e	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
183b5bce-b066-4362-9eb2-1666c14f1f19	3ecc113e-20a8-4c70-9608-b47ad56d0079	5b76c619-ca37-4e5e-9f3f-7c9255f58222	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
9c0bad27-8cc0-47a1-a2c8-9864b624a990	3ecc113e-20a8-4c70-9608-b47ad56d0079	5b76c619-ca37-4e5e-9f3f-7c9255f58222	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
8cd73e48-2e13-47b5-a865-1866d96cb004	3ecc113e-20a8-4c70-9608-b47ad56d0079	329dbcd1-4208-4bb5-843e-b1cb1da799d2	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
671ca636-f5ea-4ff7-ae0f-c7f24eabeb41	3ecc113e-20a8-4c70-9608-b47ad56d0079	329dbcd1-4208-4bb5-843e-b1cb1da799d2	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
4722ae0c-eb2f-4d37-8c19-22bf47ee2ffc	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	368ba3e3-7b6d-4a4d-95ab-af081466c45a	16	34.437	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
c0270e83-f173-4a5c-a45d-61d9d0b94afe	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	368ba3e3-7b6d-4a4d-95ab-af081466c45a	16	40.049	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	t	f	ACT
20a27e70-f0ef-4274-ad00-a7fd10990aa7	3ecc113e-20a8-4c70-9608-b47ad56d0079	f512a647-066e-4626-9547-6c2f25dafc34	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
ac1dad64-0447-42fd-b70c-ec405b5e6b9f	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	368ba3e3-7b6d-4a4d-95ab-af081466c45a	16	38.287	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
192d4be9-c95c-42dd-aa0b-8e6ad04d9ae3	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	7d302c30-4506-41a2-9eca-43e47ce03631	17	43.545	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
8bb54250-22aa-4599-b333-c4024319cdd5	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	7d302c30-4506-41a2-9eca-43e47ce03631	17	31.204	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
648999db-4f01-4707-8a33-258f7ecb4170	dc423d3f-e28e-4913-9343-236c705cb3f2	1719d40e-0ce9-453f-a235-79539d6e80fa	7d302c30-4506-41a2-9eca-43e47ce03631	17	37.703	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
44a62df4-0622-4ccc-97f5-3c26f230a20d	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	18	36.246	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
d6113c2a-497c-43ce-9118-30d7a233e329	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	18	59.395	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
06b3ab25-7cd9-49c1-91fa-d36b9be167d2	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	18	44.922	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
39589ea5-5b80-47ce-8fd4-704534c8c5a3	3ecc113e-20a8-4c70-9608-b47ad56d0079	f512a647-066e-4626-9547-6c2f25dafc34	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	69.531	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
17ec585d-fad3-47b0-a066-5db9918694f7	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	19	36.174	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
a1c8021d-adcb-41b3-828b-1ea5a4b12b68	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	19	59.823	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
5b6ef3e0-6653-4c45-ac30-85323fe999c4	dc423d3f-e28e-4913-9343-236c705cb3f2	07d05024-6538-4057-bad3-c39e73437824	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	19	44.518	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
2b241dd4-f230-4f2a-9834-b7d5ccd75f0a	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	50c728b4-196e-4a63-8406-6031609368ed	20	32.936	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
2932bd9a-ddb6-449a-b4eb-ed3834edaee9	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	50c728b4-196e-4a63-8406-6031609368ed	20	38.75	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
73010861-7bf2-4757-b4cd-8d100a3c17ae	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	50c728b4-196e-4a63-8406-6031609368ed	20	48.816	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
86ac5e2a-98df-407a-b0a1-14170c0649d8	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	21	40.016	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	t	f	ACT
db3a71cd-e20f-4464-a9a2-3705aae27462	3ecc113e-20a8-4c70-9608-b47ad56d0079	addf3011-b1f5-4ef6-a551-4148484c44a8	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
6354481d-c0fc-4a87-821f-ec65c17d5461	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	21	31.365	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
5e03edc6-f2c0-4b36-8c8a-3b006a3714d6	dc423d3f-e28e-4913-9343-236c705cb3f2	f2736f84-ee79-4f28-a55d-cb2eb7ad5f70	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	21	49.526	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
8feacd0d-77b6-46d9-a284-6d17064d78ea	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	8bd83a59-ffa6-4a99-9d9c-d258abe64802	22	36.07	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
ce18a6fb-9f89-4af7-bc72-6a19f3274607	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	8bd83a59-ffa6-4a99-9d9c-d258abe64802	22	43.496	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
0fe706e0-ce28-447e-a94d-c063def2c8e8	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	8bd83a59-ffa6-4a99-9d9c-d258abe64802	22	50.598	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
6e9bf995-0d42-4bfb-a460-891e477f9c44	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	368ba3e3-7b6d-4a4d-95ab-af081466c45a	23	36.279	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
04b51463-fd87-4c1f-a073-3c78a231d55d	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	368ba3e3-7b6d-4a4d-95ab-af081466c45a	23	49.191	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	t	f	ACT
239958d6-fe65-43c5-8801-a3afab9cec08	3ecc113e-20a8-4c70-9608-b47ad56d0079	addf3011-b1f5-4ef6-a551-4148484c44a8	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
3fd9c3bf-b7df-4dc6-a53b-8bec523a3116	dc423d3f-e28e-4913-9343-236c705cb3f2	3e28eeaa-be9a-4350-9d73-e3abc271fd3f	368ba3e3-7b6d-4a4d-95ab-af081466c45a	23	45.12	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
7766f21a-d87f-4a02-ba04-4dff2774ad89	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	8bd83a59-ffa6-4a99-9d9c-d258abe64802	24	44.286	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
6ccd5deb-1605-4ad7-9509-ac6c5687be28	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	8bd83a59-ffa6-4a99-9d9c-d258abe64802	24	54.928	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	t	f	ACT
eeb67881-30c1-497e-b4f3-62d17d0454c6	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	8bd83a59-ffa6-4a99-9d9c-d258abe64802	24	53.589	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	f	f	ACT
a7797f6d-6207-4f43-b515-fa063d88ab87	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	50c728b4-196e-4a63-8406-6031609368ed	25	43.504	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	1	f	f	ACT
c9046939-f729-4383-bb57-d7e5fb76799e	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	50c728b4-196e-4a63-8406-6031609368ed	25	49.934	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	2	f	f	ACT
de74706e-6d3e-4ade-96aa-b013da5e1ed3	dc423d3f-e28e-4913-9343-236c705cb3f2	25432d3b-14cd-4b50-b5dd-7710e84186a9	50c728b4-196e-4a63-8406-6031609368ed	25	58.912	\N	\N	\N	t	f	2022-09-08 11:42:13.687427+00	2022-09-08 11:42:13.687427+00	3	t	f	ACT
d74ca654-2981-4db7-a780-206bd44b4ea8	3ecc113e-20a8-4c70-9608-b47ad56d0079	77271bf0-56a2-4d01-bcd8-3d255340c49b	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
42f16b30-bb33-44b6-bfd9-154db15c05be	3ecc113e-20a8-4c70-9608-b47ad56d0079	fe53bc51-9488-4293-9c26-508fd827eb07	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
79d3f760-4e86-4739-8ce6-6390ca26c4c2	3ecc113e-20a8-4c70-9608-b47ad56d0079	77271bf0-56a2-4d01-bcd8-3d255340c49b	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
9810f566-7745-47e2-abb0-fd913d4b8e3b	3ecc113e-20a8-4c70-9608-b47ad56d0079	964f4597-6164-4313-8b49-26fc17f45697	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
7cea3443-0350-4ffc-9f37-163a3993b3ef	3ecc113e-20a8-4c70-9608-b47ad56d0079	964f4597-6164-4313-8b49-26fc17f45697	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
a8fb9e64-6ca1-4d28-af69-758993ac38b2	3ecc113e-20a8-4c70-9608-b47ad56d0079	fe53bc51-9488-4293-9c26-508fd827eb07	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
7b01c022-5494-401a-90e2-8e99f89bc26d	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
9c8dd0e2-bc08-4a7c-b063-33febab8fb28	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
5541bbe0-4b7c-4a42-b25c-31a2de2bc141	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
f9e9548b-2b61-4cc0-b6a2-49c7a86ff6a5	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
07e18e4a-2c9e-4816-a107-91ebaa5aca73	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c211cddd-6e67-4b8d-8473-07551b5fd221	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
da868866-5781-4129-9565-3aae9dcdd893	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
b22d11cf-75f9-4e13-b647-5d43b83d7f47	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
e8f6f398-14d5-4b38-84a2-fb60bb17be11	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
92b1de29-dde5-43bd-9012-cde015942745	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
88b8ad1b-4b7e-45f5-b091-d79320fb7cf6	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
d875107c-60df-4a92-b32c-a8fde6428aa5	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
b109741b-5429-46da-9f19-f9c35f4a8014	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	3555ad6e-4378-4820-b377-30e28434a65f	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
392b153f-0881-45ff-9c3d-e04b766c5768	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
0298a56e-0d5c-49b2-8f2b-8dda3b79bcd3	3cd79f71-bb2c-49de-b0f4-da603ca913b3	90fd1590-3d91-4624-b7f1-944a27c172ad	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
eda67f23-2a28-4cf7-a88a-9cc5cf98b18a	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	50c728b4-196e-4a63-8406-6031609368ed	1	48.848	\N	1	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	t	f	ACT
7e4a269c-01f8-4eae-98b9-33b10d83c884	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	50c728b4-196e-4a63-8406-6031609368ed	1	66.008	\N	1	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	f	f	ACT
737e30d0-4cee-4c08-a9be-075f2292f84d	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	50c728b4-196e-4a63-8406-6031609368ed	1	50.471	\N	1	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	f	f	ACT
7ec38fd5-caea-4fe1-b938-1c2ab2521539	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	50c728b4-196e-4a63-8406-6031609368ed	1	47.449	\N	1	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	f	f	ACT
82e8b23c-db36-426b-a462-bcfa75ad7913	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	46.423	\N	2	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	f	f	ACT
c8a2161c-eae5-426a-8ad9-e2fa386aaab2	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	67.658	\N	2	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	f	f	ACT
6979d646-46da-477e-9ff6-4360f112b4f3	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	50.822	\N	2	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	f	f	ACT
f68b8c97-cdaa-432b-a531-22a48ed82e8b	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	368ba3e3-7b6d-4a4d-95ab-af081466c45a	2	48.799	\N	2	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	t	f	ACT
53ca7e81-c84a-4623-8a10-6a921777e980	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	42dd513a-7a48-4389-a17d-d78aadce80c3	3	46.392	\N	3	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	f	f	ACT
ae23ce37-6e05-49e6-9de1-67f8fec20c31	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a2e2c536-8c59-4dff-b94b-9dc9a704f1f3	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
b248edc7-5704-4027-be5f-3387fb18f867	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	42dd513a-7a48-4389-a17d-d78aadce80c3	3	66.489	\N	3	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	f	f	ACT
107cc027-a92b-4eb5-bba6-f676e41c5dfe	3cd79f71-bb2c-49de-b0f4-da603ca913b3	9aa99909-111f-4290-9979-f6b3888a78b0	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	t	\N
628128e2-c516-49e3-b57a-9c63432f88ac	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	42dd513a-7a48-4389-a17d-d78aadce80c3	3	52.278	\N	3	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	t	f	ACT
c67df584-2031-40de-b852-65e109b80b5f	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	42dd513a-7a48-4389-a17d-d78aadce80c3	3	47.481	\N	3	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	f	f	ACT
f4e02da6-80cd-42be-b647-18a0a3b47139	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7d302c30-4506-41a2-9eca-43e47ce03631	4	48.744	\N	4	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	t	f	ACT
20772cae-0695-406d-966c-78a53b077164	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7d302c30-4506-41a2-9eca-43e47ce03631	4	65.576	\N	4	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	f	f	ACT
b103668a-8f60-4bf8-a8d6-376d14fe4853	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7d302c30-4506-41a2-9eca-43e47ce03631	4	49.887	\N	4	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	f	f	ACT
c15aeca6-1f2c-4b25-b3df-e19d53261b07	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7d302c30-4506-41a2-9eca-43e47ce03631	4	48.512	\N	4	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	f	f	ACT
26cc427d-5d38-46b8-89cd-e22a89bfc712	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	46.339	\N	5	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	f	f	ACT
3b7ff5d1-c698-41d1-899d-8bdecfc42298	3cd79f71-bb2c-49de-b0f4-da603ca913b3	fd45d0d8-03f9-4526-aae4-b567586ade74	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
8f3f9609-2057-4006-a732-268f1f9343cd	3cd79f71-bb2c-49de-b0f4-da603ca913b3	fd45d0d8-03f9-4526-aae4-b567586ade74	aa538b11-123d-4ce6-a85f-1954d88dca71	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
bfa87150-9f4b-4ef2-9bc2-d479cb6fc215	3cd79f71-bb2c-49de-b0f4-da603ca913b3	a2e2c536-8c59-4dff-b94b-9dc9a704f1f3	b6288334-84e9-4346-9540-9db9d25ebf18	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
6b8161fc-610f-4ba9-9188-12412461a2e5	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	68.705	\N	5	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	t	f	ACT
06d58516-0229-4a35-b1a4-b8f48937fcad	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	51.408	\N	5	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	f	f	ACT
f8778f88-e016-4859-b62f-461cfca6c6b9	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	7c7385f1-259e-4e9b-bed3-031a2ed5041c	5	48.734	\N	5	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	f	f	ACT
b63e0b2d-2c17-4b0c-9913-f58bf40940be	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	49.098	\N	6	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	1	f	f	ACT
55cbc5dc-3695-4b3d-a58b-79b417d03a3d	3cd79f71-bb2c-49de-b0f4-da603ca913b3	15c272fd-57be-4cfc-8790-9eeed6604b74	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
d318cfc8-d24a-4c6b-ab4f-51dbde20ae54	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	67.215	\N	6	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	2	t	f	ACT
ed379bf7-284f-4d06-82c9-952f6f19c889	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	50.404	\N	6	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	3	f	f	ACT
58c5ad75-b598-4367-8634-07ed7f9774a3	dc423d3f-e28e-4913-9343-236c705cb3f2	1e147a9f-e534-4af7-8ef6-de08c6850673	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	6	49.779	\N	6	\N	t	f	2022-09-08 11:59:39.495359+00	2022-09-08 11:59:39.495359+00	4	f	f	ACT
c396e95d-f647-4a59-9bd5-c0b443891cf0	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	44.062	\N	1	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	1	f	f	ACT
bc71445b-ce34-499c-a324-77e9000afc2e	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	53.711	\N	1	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	2	f	f	ACT
f2a79a39-a05e-4e25-ad89-e25b9d198ccd	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	55.575	\N	1	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	3	f	f	ACT
81deb4fd-92e7-4111-99ca-8d11046610b1	3cd79f71-bb2c-49de-b0f4-da603ca913b3	1a8769e0-d3c4-48cd-a7dd-4fa7195f4d61	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
c763b68b-de5a-444f-ac18-56bad8bb156a	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	8bd83a59-ffa6-4a99-9d9c-d258abe64802	1	49.639	\N	1	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	4	t	f	ACT
c4dd5a4e-b18c-4b28-ba22-83400531f3f2	3cd79f71-bb2c-49de-b0f4-da603ca913b3	15c272fd-57be-4cfc-8790-9eeed6604b74	3555ad6e-4378-4820-b377-30e28434a65f	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
6579d8e9-f501-42a0-bd24-d7a0cdfbed96	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	42.128	\N	2	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	1	f	f	ACT
6f764fc1-eb1c-4070-97bd-952fc9722aac	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	53.855	\N	2	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	2	f	f	ACT
a9149513-f3cb-4d7f-ae4e-59b35c107826	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	55.999	\N	2	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	3	t	f	ACT
75b624fd-b8af-460f-820e-b72b4f9a9d0f	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	2	49.198	\N	2	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	4	f	f	ACT
2c81eb7f-db54-4cfd-8f0b-d78f0dc1a634	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	48.081	\N	3	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	1	t	f	ACT
351856a0-fd94-4917-984d-62e6c58d5f05	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	51.957	\N	3	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	2	f	f	ACT
56c35406-c8c7-4c3d-b6b1-726274099b4c	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	54.963	\N	3	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	3	f	f	ACT
7b28a7fd-be2f-4516-9c88-34837e180aef	3cd79f71-bb2c-49de-b0f4-da603ca913b3	6ca36f9f-b8da-4ac7-bac6-8410ce6bf255	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
afac2544-175f-4fd7-8ae8-1f141097ad6e	3cd79f71-bb2c-49de-b0f4-da603ca913b3	6ca36f9f-b8da-4ac7-bac6-8410ce6bf255	34154703-e8e1-4857-b50c-5ca928631056	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
3572aff4-8857-44bb-8e3f-4bc7c218bc91	3cd79f71-bb2c-49de-b0f4-da603ca913b3	1a8769e0-d3c4-48cd-a7dd-4fa7195f4d61	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
d0347055-13b1-4135-9358-b55876823ccf	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	49.428	\N	3	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	4	f	f	ACT
4715a7bf-702c-4fb7-bf59-eec68ea07233	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	394e070d-2570-48e2-90ba-a2622a8b4925	4	46.623	\N	4	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	1	t	f	ACT
1fcc3c4b-ba62-405d-88b7-e1fc32a7c79b	3cd79f71-bb2c-49de-b0f4-da603ca913b3	adc9fc24-82be-411c-8040-04b1af48bf77	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
dc79c7db-52f8-40ff-8c87-471e8c08d81c	3cd79f71-bb2c-49de-b0f4-da603ca913b3	adc9fc24-82be-411c-8040-04b1af48bf77	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
8746b957-28b5-40d6-8400-7472ad63823c	3cd79f71-bb2c-49de-b0f4-da603ca913b3	f4103c47-80da-42c6-88d2-51e9985ad590	95d3b712-09f7-4750-88ae-376680c67a8a	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
ed31f70f-3ba7-4d77-9d1b-2995e128afa3	3cd79f71-bb2c-49de-b0f4-da603ca913b3	f4103c47-80da-42c6-88d2-51e9985ad590	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
97dd0d8e-6779-41eb-9d46-0a3f124f7140	3cd79f71-bb2c-49de-b0f4-da603ca913b3	ce6078e7-61f4-4657-803c-cec402fc0f8a	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
6879e809-93f2-4ee2-a2c9-714b41046de6	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	394e070d-2570-48e2-90ba-a2622a8b4925	4	53.167	\N	4	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	2	f	f	ACT
ec062925-f28b-4b63-8e83-879bf647189a	3cd79f71-bb2c-49de-b0f4-da603ca913b3	2644bc75-4a5d-4f22-9fa4-90294a4dd48a	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
fec33fba-10ef-41b4-94b8-66afde62b7ef	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	394e070d-2570-48e2-90ba-a2622a8b4925	4	54.912	\N	4	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	3	f	f	ACT
5aff0d9d-0d59-43b8-acea-3de2531fc1c0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	ce6078e7-61f4-4657-803c-cec402fc0f8a	50c728b4-196e-4a63-8406-6031609368ed	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
2f44b305-619b-4234-9313-3837528c0c72	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	394e070d-2570-48e2-90ba-a2622a8b4925	4	49.286	\N	4	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	4	f	f	ACT
c54eefce-c195-4c5d-82be-b83b95b73f4f	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	44.903	\N	5	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	1	f	f	ACT
8484d05f-e878-44b6-837a-5cca1a8cf9a6	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	66.098	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
1378ae75-8938-40e7-bfa6-2f4f5c3faff6	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	53.967	\N	5	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	2	f	f	ACT
57232b65-a679-415c-bbf0-7c80a860bbf0	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3c7c3265-1bfb-4997-9488-ea42a2989cd5	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
8dfd610d-0520-4103-aaac-69f6fe6f5a36	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	54.561	\N	5	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	3	f	f	ACT
74571c56-072d-4791-af41-5d1cbed460a8	dc423d3f-e28e-4913-9343-236c705cb3f2	8a04d0df-cbd9-4958-8810-c9e55c202072	a4452a78-f47d-4ddd-bc45-e59b916afdf8	5	52.15	\N	5	\N	t	f	2022-09-08 12:07:51.89708+00	2022-09-08 12:07:51.89708+00	4	t	f	ACT
43dae7d1-cefb-4d21-a0d0-94c618eb10e8	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	95d3b712-09f7-4750-88ae-376680c67a8a	0	66.73	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
7dd82f49-63d8-4882-aee4-a38d524cf5dd	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	1	45.464	\N	1	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	1	f	f	ACT
afc0c239-a6f0-4616-be82-466afbd4a1c4	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3c7c3265-1bfb-4997-9488-ea42a2989cd5	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
0a55645b-6c9a-414e-952c-c2fa75cdf0ef	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	1	47.286	\N	1	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	2	f	f	ACT
62adcbc6-c6ff-4785-9d86-dca3eb45b7e2	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	1	66.992	\N	1	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	3	f	f	ACT
6dacb2c6-06ae-4700-8ce0-a0ed9ad2fbcb	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	66.641	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
1aa762d6-3e7f-4fc2-a763-0b9a3e38cfac	3cd79f71-bb2c-49de-b0f4-da603ca913b3	69888db5-0d36-46cd-9d7a-2b6eea6692f5	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
c5bae272-6c28-4fa9-b326-1337c1223493	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	1	44.71	\N	1	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	4	t	f	ACT
8a89460e-9f18-478b-a9c5-3db40de1c333	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	394e070d-2570-48e2-90ba-a2622a8b4925	2	47.36	\N	2	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	1	f	f	ACT
48f3151b-4ba7-46d7-af1c-124c2d522ede	3cd79f71-bb2c-49de-b0f4-da603ca913b3	69888db5-0d36-46cd-9d7a-2b6eea6692f5	95d3b712-09f7-4750-88ae-376680c67a8a	0	101.117	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
3fe5164d-b153-44d1-a662-820e3d01d0df	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	394e070d-2570-48e2-90ba-a2622a8b4925	2	47.318	\N	2	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	2	f	f	ACT
a2700aab-41f9-4065-a861-326c11580939	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	394e070d-2570-48e2-90ba-a2622a8b4925	2	67.829	\N	2	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	3	t	f	ACT
db2d8bac-b4b2-480f-bffc-6a46e6b5a4ba	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3dd2b601-69bd-4687-b14c-0b0386346f0e	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
6b80d093-4dac-44f4-8051-ebddd154332c	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	394e070d-2570-48e2-90ba-a2622a8b4925	2	43.352	\N	2	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	4	f	f	ACT
41e1f6c5-06f7-42d5-ae3f-b7ea368fa22f	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	42dd513a-7a48-4389-a17d-d78aadce80c3	3	46.649	\N	3	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	1	f	f	ACT
a08cd96a-dbd0-40f1-8b22-d69609ae7f40	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3dd2b601-69bd-4687-b14c-0b0386346f0e	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	64.903	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
149f779e-b0be-498f-a143-ea8f8f4b381e	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	42dd513a-7a48-4389-a17d-d78aadce80c3	3	47.253	\N	3	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	2	f	f	ACT
26d89ea1-a366-47b3-91b2-bb0cd5eef1bc	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	42dd513a-7a48-4389-a17d-d78aadce80c3	3	68.622	\N	3	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	3	t	f	ACT
86611d42-b95f-4e51-a028-13c54254dc5a	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3010621c-c500-44db-955b-7079a549501b	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
d1cd03fb-8f76-469f-8215-708ca24a4702	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	42dd513a-7a48-4389-a17d-d78aadce80c3	3	43.454	\N	3	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	4	f	f	ACT
63107071-a3ec-43ec-996c-d82f22ab2839	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	7c7385f1-259e-4e9b-bed3-031a2ed5041c	4	48.261	\N	4	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	1	t	f	ACT
ab7c2e5c-f11a-4c4a-94ca-8a5db4fc1d12	3cd79f71-bb2c-49de-b0f4-da603ca913b3	3010621c-c500-44db-955b-7079a549501b	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
9cf93346-a590-4a06-a9f0-c28f0fd60d8e	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	7c7385f1-259e-4e9b-bed3-031a2ed5041c	4	47.607	\N	4	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	2	f	f	ACT
5abd726f-4f28-40f6-a937-8d888696671e	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	7c7385f1-259e-4e9b-bed3-031a2ed5041c	4	67.926	\N	4	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	3	f	f	ACT
d2daadf6-b57b-4e50-844d-fd0b7c4ac298	3cd79f71-bb2c-49de-b0f4-da603ca913b3	b587c8fa-b33c-4c4b-a65b-a8c04f67682b	7d302c30-4506-41a2-9eca-43e47ce03631	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
391f332f-0989-403a-9c42-ae88d9cbc01c	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	7c7385f1-259e-4e9b-bed3-031a2ed5041c	4	43.606	\N	4	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	4	f	f	ACT
f1ed6ce9-4fea-4ba8-9392-7001976f7c6e	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	49.501	\N	5	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	1	t	f	ACT
27110e50-67d5-4219-b2f0-e67d62e4668d	3cd79f71-bb2c-49de-b0f4-da603ca913b3	b587c8fa-b33c-4c4b-a65b-a8c04f67682b	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	f	f	\N
828f9b63-08e5-4d45-8667-4834ad71f2f9	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	47.087	\N	5	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	2	f	f	ACT
f1ff7e5f-ac72-45c1-b0e9-88bb2a35c80e	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	67.199	\N	5	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	3	f	f	ACT
b291c2e2-6c7b-4724-8eb4-3f713790fcdb	3cd79f71-bb2c-49de-b0f4-da603ca913b3	2644bc75-4a5d-4f22-9fa4-90294a4dd48a	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	4	t	f	\N
3405d2f4-b51c-4767-9f35-52658c6033ef	dc423d3f-e28e-4913-9343-236c705cb3f2	e047a20f-5f3e-4587-bf5b-027c96ff6d8a	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	47.966	\N	5	\N	t	f	2022-09-08 12:19:51.940376+00	2022-09-08 12:19:51.940376+00	4	f	f	ACT
0c96968a-3c04-480c-887e-6ff557cfde2c	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	368ba3e3-7b6d-4a4d-95ab-af081466c45a	1	48.654	\N	1	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	1	f	f	ACT
ca5e517c-b028-4cca-802c-7a1c11842a12	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	7d302c30-4506-41a2-9eca-43e47ce03631	0	66.797	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
1ce30bdd-5e19-4b03-8b17-57b5129ecee5	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	67.359	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
b9491f03-3d9f-4133-b937-52ad84786609	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	34154703-e8e1-4857-b50c-5ca928631056	0	67.461	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
7e7afbf4-489e-402f-bcb7-b2a0281afc8d	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	67.535	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
93c160eb-de67-4c9d-87fe-e7b68799ce70	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	aa538b11-123d-4ce6-a85f-1954d88dca71	0	68.094	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
55522e8f-b1af-4850-abe7-2e0f081778d0	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	368ba3e3-7b6d-4a4d-95ab-af081466c45a	1	46.871	\N	1	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	2	f	f	ACT
5bcb577d-1d0c-4840-bcf1-cd1927d9a202	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	368ba3e3-7b6d-4a4d-95ab-af081466c45a	1	53.767	\N	1	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	3	f	f	ACT
fa1d4fb2-0ad7-4fdf-9712-29a476bb8e4c	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	368ba3e3-7b6d-4a4d-95ab-af081466c45a	1	37.71	\N	1	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	4	t	f	ACT
e022ab2c-4837-4b64-b2d5-673beaad555a	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	2	48.71	\N	2	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	1	t	f	ACT
f8d52fcc-7c15-460f-b3d6-eba0c8297887	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	2	46.983	\N	2	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	2	f	f	ACT
28bec925-8c05-4021-8b01-06a99e1c3a28	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	67.922	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
a9380f2c-5dbf-489a-b14b-eb8aca0eab05	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	68.187	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
310210b7-5aaa-41ee-b5dc-bb729078bed1	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	4db9c2e5-9eda-40b7-8250-71ecfa73b13a	0	68.484	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
bb155ffe-6028-4039-bc6a-8a99b295e0a8	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	3555ad6e-4378-4820-b377-30e28434a65f	0	68.828	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
b406c55c-6336-410b-82ae-31c2fbbaf3e6	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	b6288334-84e9-4346-9540-9db9d25ebf18	0	68.996	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
c2e6c96b-8fc5-4959-b930-8083f36dea91	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	69.508	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	1	f	f	\N
592cce89-48f9-4f82-9fca-78babec55d83	fdb36615-d7b0-4b83-8189-1cf03abbc692	842a1c5a-4008-4cb4-bcf7-c7e9a57e0b28	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
64aa2a7b-1ff3-42cf-8c2d-1c67851f5d04	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	2	53.567	\N	2	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	3	f	f	ACT
c82f2b48-8424-4973-8e26-5a27ea3739e5	fdb36615-d7b0-4b83-8189-1cf03abbc692	3cde7fd0-004a-43bb-9cd4-dee6a7c5765e	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	72.52	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	t	\N
fae7eab0-9399-42a4-9306-bd8b742a5665	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	2	37.831	\N	2	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	4	f	f	ACT
26421a11-c13a-4325-9f2f-3dbe14789488	fdb36615-d7b0-4b83-8189-1cf03abbc692	0233edb1-bc26-40c3-89b2-db50ebb16b33	aa538b11-123d-4ce6-a85f-1954d88dca71	0	67.437	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
24d7d1b3-41fc-4f66-81be-bd4f9ee9a498	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	7d302c30-4506-41a2-9eca-43e47ce03631	3	47.764	\N	3	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	1	f	f	ACT
e35a3821-fcfa-4dda-a4a4-b59a682c4704	fdb36615-d7b0-4b83-8189-1cf03abbc692	0233edb1-bc26-40c3-89b2-db50ebb16b33	b9e90030-eec1-4140-b55d-cb558b60ca6c	0	73.473	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
77d5a4ff-4b42-4655-b1f9-aac9472e27e6	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	7d302c30-4506-41a2-9eca-43e47ce03631	3	48.072	\N	3	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	2	t	f	ACT
0dbf6423-ea59-4185-94f2-c70b7441d2d9	fdb36615-d7b0-4b83-8189-1cf03abbc692	63b41092-7600-4edb-ae2c-ce70d1558827	7d302c30-4506-41a2-9eca-43e47ce03631	0	73.485	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
2966b154-3bb1-4850-9be3-f56fad836fc8	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	7d302c30-4506-41a2-9eca-43e47ce03631	3	52.311	\N	3	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	3	f	f	ACT
8590502b-0d34-4c24-8990-6cf3d750cf97	fdb36615-d7b0-4b83-8189-1cf03abbc692	63b41092-7600-4edb-ae2c-ce70d1558827	b6288334-84e9-4346-9540-9db9d25ebf18	0	74.465	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
081b7e21-4a2c-4f6d-832d-0a687ee3075a	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	7d302c30-4506-41a2-9eca-43e47ce03631	3	38.176	\N	3	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	4	f	f	ACT
53a496b5-f76c-4ac4-a5b4-ce7c88fc9d12	fdb36615-d7b0-4b83-8189-1cf03abbc692	9e9272f3-3c9a-4759-9e14-96d0714f69c5	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	68.59	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
8e71e96b-6bc3-43fa-8846-1e880277bce0	fdb36615-d7b0-4b83-8189-1cf03abbc692	9e9272f3-3c9a-4759-9e14-96d0714f69c5	3555ad6e-4378-4820-b377-30e28434a65f	0	0	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	0	f	f	\N
e985bb2b-3216-4f66-8011-271932006c1b	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	48.453	\N	4	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	1	f	f	ACT
7eaa05b1-17f2-4976-9f8d-469b31809701	fdb36615-d7b0-4b83-8189-1cf03abbc692	c3c7a90e-9633-4bae-987c-429708b81168	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	74.371	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
f24382a1-2b48-4103-8321-6639381b1e00	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	48.504	\N	4	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	2	f	f	ACT
15aac0ba-156f-4726-a1f6-dae170f345e3	fdb36615-d7b0-4b83-8189-1cf03abbc692	c3c7a90e-9633-4bae-987c-429708b81168	7c1753ff-f867-44df-8052-6e634163a215	0	68.269	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
a7a03911-bb2e-4b68-a55c-ec97ab24073b	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	52.351	\N	4	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	3	t	f	ACT
92c6e392-b74e-4dfb-b1c7-131f1aaf4fb9	fdb36615-d7b0-4b83-8189-1cf03abbc692	d8868ad4-c8e9-44ac-a979-9245a96c1841	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	67.457	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
ea6f22d6-3b13-4861-b210-ce7b44bb75a5	dc423d3f-e28e-4913-9343-236c705cb3f2	54176329-3216-40dd-9e1f-3d50529f8287	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	38.591	\N	4	\N	t	f	2022-09-08 12:19:54.906544+00	2022-09-08 12:19:54.906544+00	4	f	f	ACT
2c183fbd-19fb-427b-b813-cf0a83be3d7c	fdb36615-d7b0-4b83-8189-1cf03abbc692	d8868ad4-c8e9-44ac-a979-9245a96c1841	a72fd561-0a12-47ba-8d4b-35bfade8497c	0	73.566	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
df5a708a-5d3e-450c-9f20-76ee1803758f	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	42dd513a-7a48-4389-a17d-d78aadce80c3	1	40.615	\N	1	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	1	f	f	ACT
1f362f15-e400-4f71-8ac5-3c5e7136e542	fdb36615-d7b0-4b83-8189-1cf03abbc692	5bfbb14d-540c-43bf-8a50-d2619a029c53	95d3b712-09f7-4750-88ae-376680c67a8a	0	74.355	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
df8effb7-2f94-48c7-b440-0466ae421782	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	42dd513a-7a48-4389-a17d-d78aadce80c3	1	44.255	\N	1	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	2	f	f	ACT
035a0ef4-f30f-42f8-950f-02337ccf8495	fdb36615-d7b0-4b83-8189-1cf03abbc692	5bfbb14d-540c-43bf-8a50-d2619a029c53	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	0	74.785	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
694ae51b-e9cb-4712-8705-0466bf6ed086	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	42dd513a-7a48-4389-a17d-d78aadce80c3	1	45.591	\N	1	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	3	f	f	ACT
03694700-381d-4ab4-8e53-5d4b6323ac41	fdb36615-d7b0-4b83-8189-1cf03abbc692	a8e9f94a-4115-44a3-a3ea-adc568ecfcaa	34154703-e8e1-4857-b50c-5ca928631056	0	68.117	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
b4c1db7c-1073-4241-bf28-eee706fcbd21	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	42dd513a-7a48-4389-a17d-d78aadce80c3	1	40.694	\N	1	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	4	t	f	ACT
a5fc2e66-6c10-4047-b91f-f2d2146c6b57	fdb36615-d7b0-4b83-8189-1cf03abbc692	a8e9f94a-4115-44a3-a3ea-adc568ecfcaa	4db9c2e5-9eda-40b7-8250-71ecfa73b13a	0	67.406	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
8a7726fc-d9fb-488f-b907-fab70d05ecfe	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7d302c30-4506-41a2-9eca-43e47ce03631	2	41.318	\N	2	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	1	t	f	ACT
261a775b-8837-402d-a7cd-3a6f5d4fb01e	fdb36615-d7b0-4b83-8189-1cf03abbc692	653c5690-866f-47c1-aa34-6e7c3d21ed9a	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	73.004	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
3e7799af-ec11-40fa-b1ea-25b0b83499a9	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7d302c30-4506-41a2-9eca-43e47ce03631	2	43.35	\N	2	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	2	f	f	ACT
aca2826a-059f-42bd-809d-a1ebce239b07	fdb36615-d7b0-4b83-8189-1cf03abbc692	653c5690-866f-47c1-aa34-6e7c3d21ed9a	aa538b11-123d-4ce6-a85f-1954d88dca71	0	67.25	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
9b5db87c-f3da-482f-be95-fd2339b74c18	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7d302c30-4506-41a2-9eca-43e47ce03631	2	48.094	\N	2	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	3	f	f	ACT
fac03ffe-9ec7-4879-8ab7-bd29afac10e4	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7d302c30-4506-41a2-9eca-43e47ce03631	2	38.319	\N	2	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	4	f	f	ACT
6835f73d-7fbf-404d-a448-0d33817de4f1	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7c7385f1-259e-4e9b-bed3-031a2ed5041c	3	42.094	\N	3	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	1	f	f	ACT
a22a286b-83aa-43d7-8c19-545c525f5ed3	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7c7385f1-259e-4e9b-bed3-031a2ed5041c	3	46.225	\N	3	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	2	t	f	ACT
41cd8131-1ed4-43d7-8437-3bcbe169cf8d	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7c7385f1-259e-4e9b-bed3-031a2ed5041c	3	46.349	\N	3	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	3	f	f	ACT
eb0b694b-b4fd-4ca1-ab97-a93a35c1c3e7	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	7c7385f1-259e-4e9b-bed3-031a2ed5041c	3	38.416	\N	3	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	4	f	f	ACT
02d6bafb-c0a2-422c-b3c2-2c072b1b85e1	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	43.214	\N	4	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	1	f	f	ACT
9c15e11f-144e-4d2b-b431-2a57a87503ea	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	46.077	\N	4	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	2	t	f	ACT
24911ab2-29cd-46a8-bdf9-a15eedf623d9	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	46.432	\N	4	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	3	f	f	ACT
10528d4f-36e7-4424-9285-2ad1e9c11558	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	a4452a78-f47d-4ddd-bc45-e59b916afdf8	4	38.303	\N	4	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	4	f	f	ACT
fe801675-a04f-46c2-8602-80596fd6df6b	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	43.423	\N	5	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	1	t	f	ACT
21f0bf10-aa20-44c0-961d-a0b423213c67	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	45.391	\N	5	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	2	f	f	ACT
01573658-3c76-43cd-9484-8e92a61e328e	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	45.975	\N	5	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	3	f	f	ACT
6702285a-e255-4024-bcc1-6c5de18240f0	dc423d3f-e28e-4913-9343-236c705cb3f2	2791d4a9-af6f-43d3-a23b-d1b42ecd4842	f9de87a9-ae4d-46be-9de6-32e59fd48cb9	5	38.536	\N	5	\N	t	f	2022-09-08 12:26:13.461665+00	2022-09-08 12:26:13.461665+00	4	f	f	ACT
178c07df-5508-458c-a0cd-b14a9adb67bc	fdb36615-d7b0-4b83-8189-1cf03abbc692	202b8b49-ac31-47a9-9ada-808c41464c64	7d302c30-4506-41a2-9eca-43e47ce03631	0	67	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
31e1401f-8e79-41ef-8ab3-8dfb4ae7f52a	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	60.334	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	ACT
6481d683-3f5b-4ec4-ba2b-209b2e840d32	fdb36615-d7b0-4b83-8189-1cf03abbc692	202b8b49-ac31-47a9-9ada-808c41464c64	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	0	73.071	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
69baf222-48d5-4aa8-9878-5b8eb05b51a0	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	56.767	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
41c319de-7e63-45f0-abc7-28aac0223833	fdb36615-d7b0-4b83-8189-1cf03abbc692	7696c493-7d1b-4f3a-82fe-9d60aff61406	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	74.086	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
2eefac66-e6aa-4500-98f5-d71b0cf04d8a	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	40.911	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
0dfd2ea6-c788-461f-b8f1-22c958cc6801	fdb36615-d7b0-4b83-8189-1cf03abbc692	7696c493-7d1b-4f3a-82fe-9d60aff61406	368ba3e3-7b6d-4a4d-95ab-af081466c45a	0	84.856	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
b3793091-5349-4fdb-8736-2b8a27aaf5d0	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	65.278	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	ACT
cc16c647-ed97-454f-a98f-34e13898e736	fdb36615-d7b0-4b83-8189-1cf03abbc692	6ecabd65-7bcf-4603-815c-2fd2ab12274a	95d3b712-09f7-4750-88ae-376680c67a8a	0	67.949	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
4c0154ec-d6da-477f-94cb-ffd8982d67f9	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	50.039	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
dc7b6527-ee87-41c6-aa5d-33f0ffe3e1f9	fdb36615-d7b0-4b83-8189-1cf03abbc692	6ecabd65-7bcf-4603-815c-2fd2ab12274a	34154703-e8e1-4857-b50c-5ca928631056	0	67.954	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
686f5854-bdac-4e0b-afc5-e7356ec8e105	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	50c728b4-196e-4a63-8406-6031609368ed	1	61.917	\N	1	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	t	f	ACT
a1b3211d-77c6-4e52-befe-100c8fae74b0	fdb36615-d7b0-4b83-8189-1cf03abbc692	5eea0a23-27ce-474d-a4e9-aeea238cf8df	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	66.289	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
97633632-2e9b-4720-b237-35fd9f9cc673	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	58.934	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	ACT
9221202e-42ca-4508-829d-6b3110ba93cb	fdb36615-d7b0-4b83-8189-1cf03abbc692	5eea0a23-27ce-474d-a4e9-aeea238cf8df	7d302c30-4506-41a2-9eca-43e47ce03631	0	67.23	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
0feeb926-8d5f-4382-917f-23026edb6ec5	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	58.766	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
2089a99c-81c0-4f76-bc07-b0c52d5110f8	fdb36615-d7b0-4b83-8189-1cf03abbc692	220e5b84-8c1a-46b0-b71b-682f0591a106	95d3b712-09f7-4750-88ae-376680c67a8a	0	74.563	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
f829cfc8-2cf0-4748-90d1-891e3be1d1b3	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	41.342	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
0bac04c9-44f1-43e2-a636-396eb2fad792	fdb36615-d7b0-4b83-8189-1cf03abbc692	220e5b84-8c1a-46b0-b71b-682f0591a106	93ca2b38-7487-4e9a-b57a-98cf962050b9	0	67.98	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
099f2a69-5e6f-4184-bf59-8f0ae3162000	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	65.03	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	ACT
ecdb0169-fe06-4eda-aa32-7f0535691ef8	fdb36615-d7b0-4b83-8189-1cf03abbc692	52f43b5c-f402-4acc-99f1-b31748a08cc6	c98215ca-b233-49f6-a9f3-3dd0e34c1011	0	70.203	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	f	f	\N
51f80596-804c-4977-a210-d3f076b24c20	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	50.503	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	t	f	ACT
ae18ed8c-04cc-4970-b11c-be664efa8db9	fdb36615-d7b0-4b83-8189-1cf03abbc692	52f43b5c-f402-4acc-99f1-b31748a08cc6	95d3b712-09f7-4750-88ae-376680c67a8a	0	72.941	\N	\N	\N	t	f	2022-08-02 09:43:00.878135+00	2022-08-02 09:43:00.878135+00	3	t	f	\N
4c51c80b-0bc5-4517-bbce-4bd13e49cb6d	957369fd-7be7-41fd-97f1-e86c258d2829	88aa75dc-04c4-43d1-acb7-11fcfada200f	7c1753ff-f867-44df-8052-6e634163a215	0	44.473	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
231e92ac-e334-4ad1-b699-bb2f0ffbdc89	957369fd-7be7-41fd-97f1-e86c258d2829	88aa75dc-04c4-43d1-acb7-11fcfada200f	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	44.539	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
df3500c5-4a81-418b-a648-923c59a981bc	957369fd-7be7-41fd-97f1-e86c258d2829	88aa75dc-04c4-43d1-acb7-11fcfada200f	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	46.085	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
b256b009-7cee-436d-8cca-361126592ac4	957369fd-7be7-41fd-97f1-e86c258d2829	88aa75dc-04c4-43d1-acb7-11fcfada200f	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	46.475	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
9faab4e4-5595-46e6-97ac-d84290971dc4	957369fd-7be7-41fd-97f1-e86c258d2829	88aa75dc-04c4-43d1-acb7-11fcfada200f	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	47.342	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
57314a91-e7ab-4f64-8d37-4e02176d3d20	957369fd-7be7-41fd-97f1-e86c258d2829	2ff4bdc6-3443-4983-a85c-958fee337ec9	7c1753ff-f867-44df-8052-6e634163a215	0	43.635	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
8b7d4c36-0962-407e-b723-89bbe706409b	957369fd-7be7-41fd-97f1-e86c258d2829	2ff4bdc6-3443-4983-a85c-958fee337ec9	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	43.843	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
8382aea5-1ab2-4d5a-9243-0305bb02a9af	957369fd-7be7-41fd-97f1-e86c258d2829	2ff4bdc6-3443-4983-a85c-958fee337ec9	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	45.441	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
a0de78d2-5e38-4c3c-a213-8a5676066391	957369fd-7be7-41fd-97f1-e86c258d2829	2ff4bdc6-3443-4983-a85c-958fee337ec9	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	45.634	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
5a39e647-1d5f-4287-8468-e84ac1bb5328	957369fd-7be7-41fd-97f1-e86c258d2829	2ff4bdc6-3443-4983-a85c-958fee337ec9	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	46.138	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	1	f	f	\N
24a38197-3f24-425a-91f9-e2f5a421bfc8	957369fd-7be7-41fd-97f1-e86c258d2829	3bc46eab-bc7a-4382-b595-a37e6904de43	7c1753ff-f867-44df-8052-6e634163a215	0	0	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	0	f	t	\N
9e799c44-188a-4193-a78d-e7fd471f3b36	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	8bd83a59-ffa6-4a99-9d9c-d258abe64802	2	61.686	\N	2	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
40b39d41-6ad7-4e18-a522-db7114a311ad	957369fd-7be7-41fd-97f1-e86c258d2829	7c73979d-ce7d-428e-ab23-1e1d944298a5	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	47.302	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
c437f972-3e75-433a-891b-a514bc859aac	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	60.959	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	ACT
45a6c563-0108-44eb-9236-490e79ef4e5f	957369fd-7be7-41fd-97f1-e86c258d2829	7c73979d-ce7d-428e-ab23-1e1d944298a5	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	46.877	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
d10bdba1-c601-44c0-97ba-202c439b43f5	957369fd-7be7-41fd-97f1-e86c258d2829	3c811c30-12db-40f4-8d5f-c4cd95a0c051	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	0	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	0	f	t	\N
66ac8e80-b068-44b0-850b-1f352a422acf	957369fd-7be7-41fd-97f1-e86c258d2829	675f201f-b645-4535-9215-f8c29263c953	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	0	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	0	f	t	\N
e3fb08ee-148d-48d3-9c85-2889f3c22d35	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	57.695	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
ba5f1ed5-4e10-49f3-ad60-7e99eccff227	957369fd-7be7-41fd-97f1-e86c258d2829	08c3fff9-b9d1-48f0-883e-4772e3ef6115	7c1753ff-f867-44df-8052-6e634163a215	0	46.344	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
2baa7647-f7cd-4257-ac66-861d4b19833a	957369fd-7be7-41fd-97f1-e86c258d2829	08c3fff9-b9d1-48f0-883e-4772e3ef6115	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	0	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	0	f	f	\N
1591877b-2e30-401d-aa64-9f66ab95b5e3	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	41.31	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
1a87e269-ce1c-4600-83e3-d7171cf6d80c	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	64.318	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	t	f	ACT
c29372dd-1880-4eaf-8c86-f9aa33e0723f	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	50.534	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
5d7de328-d341-4c6c-8ad7-53677f41e0d4	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	c4c4a20b-dc70-4806-99e2-b280f36fb4eb	3	61.607	\N	3	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
fc62dd02-7ae7-4de4-a2b0-bd646ed70019	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	59.407	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	ACT
bbeec426-cbb1-4550-908a-f1ea6e6ac937	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	59.424	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
39596ef5-7c44-4043-9d5c-bbd6c9f31ffe	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	40.757	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
f4ff9c0d-f9a7-4a0a-830c-b6bd3b49bff4	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	66.046	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	t	f	ACT
c40e7e41-38fc-43a6-a0df-34038afb6e7e	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	50.454	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
0ed09c30-f721-48dc-9b48-a531d613c624	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	368ba3e3-7b6d-4a4d-95ab-af081466c45a	4	61.303	\N	4	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
3b6655d0-95bb-4120-a599-53b299deb3f7	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	61.611	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	ACT
94ea552d-a3c7-4608-99b6-b084ecdf6ae6	957369fd-7be7-41fd-97f1-e86c258d2829	5c501594-af9b-4101-9994-65cc18c37ba9	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	45.911	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
7f1d4d08-669e-4143-9777-1ea751040145	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	58.194	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	t	f	ACT
b2a7b49a-ba6f-4b81-accf-6e2b05ef5574	957369fd-7be7-41fd-97f1-e86c258d2829	5c501594-af9b-4101-9994-65cc18c37ba9	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	44.607	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
ddc023d5-85ca-44dd-b018-1a18c4ac3753	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	47.287	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
a48814f2-d48e-444e-9918-3ae36978a477	957369fd-7be7-41fd-97f1-e86c258d2829	9eb5758e-195f-45be-a0cd-8314ec892420	7c1753ff-f867-44df-8052-6e634163a215	0	44.738	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
8d693de3-0c91-4a05-b524-a87695ae6772	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	57.374	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	ACT
b8fe3a17-2bde-48fe-8c90-d135dac0a966	957369fd-7be7-41fd-97f1-e86c258d2829	9eb5758e-195f-45be-a0cd-8314ec892420	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	45.279	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
c5e299f1-6dca-4027-b91b-577df987248b	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	52.087	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
fccd0512-2d21-4681-a05f-47ad067fc554	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	394e070d-2570-48e2-90ba-a2622a8b4925	5	60.832	\N	5	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
a4657309-76a4-43a1-af53-260b561947ad	957369fd-7be7-41fd-97f1-e86c258d2829	ec2c331b-bfe9-454f-8094-587242339abf	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	44.262	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	4	f	f	\N
a3c784ad-03a8-4d84-9b27-269251ba3997	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	62.655	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	t	f	ACT
649e82d3-d73e-4f66-be3f-fda48edccfad	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	56.359	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
14837b9f-9a89-4cfd-a7b3-86582a872291	957369fd-7be7-41fd-97f1-e86c258d2829	ec2c331b-bfe9-454f-8094-587242339abf	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	45.546	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	4	f	f	\N
b670e64a-d026-496b-bb96-f1367301ad90	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	48.762	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
5d6bd2eb-3922-4b4c-9181-aa2e2aa55fba	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	57.132	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	ACT
d91e3cf8-25ed-4644-9e11-28f365c2d87f	957369fd-7be7-41fd-97f1-e86c258d2829	ec2c331b-bfe9-454f-8094-587242339abf	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	45.884	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	4	f	f	\N
7ea38dfb-56c3-4ceb-ab24-24d4b0579a76	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	51.47	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
ae40fbcf-183d-49b0-9fc0-ab675e4cf6cc	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	e4b40121-bc71-4cb3-91ee-f27bd10af9ce	6	60.551	\N	6	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
6b0edaf2-b5b6-4c0f-92a4-2c563566c615	957369fd-7be7-41fd-97f1-e86c258d2829	ec2c331b-bfe9-454f-8094-587242339abf	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	46.935	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	4	f	f	\N
5145b615-fa61-4c55-ac66-2659ed6b5008	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	51.862	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	t	f	ACT
7afdc3c7-e43c-4ef6-aa0e-a91f01244437	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	56.536	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	f	f	ACT
192175bb-9571-4c0a-babc-8288d08c00d7	957369fd-7be7-41fd-97f1-e86c258d2829	ec2c331b-bfe9-454f-8094-587242339abf	7c1753ff-f867-44df-8052-6e634163a215	0	87.894	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	4	t	f	\N
eebbdeba-ea69-4429-87f4-cf378f61bf42	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	47.959	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	ACT
088aa3ac-47b5-4c5b-b31f-a38b93601666	957369fd-7be7-41fd-97f1-e86c258d2829	6ccda3fb-7cfe-4931-a697-b2fd05a1db11	7c1753ff-f867-44df-8052-6e634163a215	0	45.842	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	t	f	\N
2bfac1ae-ce9b-4cd6-959a-938d6041dff9	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	57.015	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	ACT
bfa16274-a3ff-4b67-b444-b1bc3c50621e	957369fd-7be7-41fd-97f1-e86c258d2829	6ccda3fb-7cfe-4931-a697-b2fd05a1db11	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	47.104	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	t	f	\N
2c2788a2-991e-4df1-ba6a-ea4e781abc4c	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	51.989	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	ACT
8287efd2-0091-4e6b-a929-1a2b0d043b53	957369fd-7be7-41fd-97f1-e86c258d2829	6ccda3fb-7cfe-4931-a697-b2fd05a1db11	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	45.438	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	f	f	\N
8d48f9d6-26e6-4672-b3b9-cd8f5909bf7f	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	7d302c30-4506-41a2-9eca-43e47ce03631	7	60.512	\N	7	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	ACT
742af880-3965-475b-bfd0-542b99cef6bb	957369fd-7be7-41fd-97f1-e86c258d2829	6ccda3fb-7cfe-4931-a697-b2fd05a1db11	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	49.282	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	3	t	f	\N
c904f0ac-f7cf-4a96-b9e9-4da042edf029	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	61.91	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	1	f	f	DNF
57de6b4a-baa9-45b6-b971-39ce41a3c7e7	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	58.31	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	2	t	f	DNF
7d69fc71-546a-42e5-8930-46d208f7e770	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	46.982	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	3	f	f	DNF
e1fc7f48-817e-452e-97d3-aabd18cca840	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	57.399	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	4	f	f	DNF
cd500454-944f-47e5-96aa-5bf041256a77	957369fd-7be7-41fd-97f1-e86c258d2829	9d7ddd7d-37b8-4ac8-a806-cf872f50f611	7c1753ff-f867-44df-8052-6e634163a215	0	44.448	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	6	f	f	\N
841000f6-1e08-443e-be4d-4b21d09a9d6b	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	\N	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	5	f	f	DNF
81229010-4a8d-4560-b8b2-09e6bfa20710	dc423d3f-e28e-4913-9343-236c705cb3f2	eb266366-691e-4b90-8b82-bb62b8007a4c	42dd513a-7a48-4389-a17d-d78aadce80c3	8	\N	\N	8	\N	t	f	2022-09-08 12:35:17.798587+00	2022-09-08 12:35:17.798587+00	6	f	f	DNF
7173d4ac-dfc3-41f6-8bf0-aa631d87451e	957369fd-7be7-41fd-97f1-e86c258d2829	9d7ddd7d-37b8-4ac8-a806-cf872f50f611	a9121752-8d18-4ec5-8ea0-ca6e1cc6e17c	0	45.149	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	6	f	f	\N
89c9ad34-d3bd-4052-b95a-a0e693373079	957369fd-7be7-41fd-97f1-e86c258d2829	9d7ddd7d-37b8-4ac8-a806-cf872f50f611	d8737390-58e5-4dd3-9e6e-b460583c7e48	0	46.013	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	6	f	f	\N
44000a5c-537d-4d0a-914b-6a53c711f8bf	957369fd-7be7-41fd-97f1-e86c258d2829	9d7ddd7d-37b8-4ac8-a806-cf872f50f611	93b77fe3-4e5c-4470-a9f7-f3451fc25ece	0	46.438	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	6	f	f	\N
d39ec553-d434-4a1e-8943-90c29f4bacb0	957369fd-7be7-41fd-97f1-e86c258d2829	9d7ddd7d-37b8-4ac8-a806-cf872f50f611	a9f027ae-20cb-448e-a7b8-ceda34386e49	0	48.94	\N	\N	\N	t	f	2022-08-02 09:44:56.257057+00	2022-08-02 09:44:56.257057+00	6	f	f	\N
\.


--
-- TOC entry 3198 (class 0 OID 19535)
-- Dependencies: 284
-- Data for Name: tourYears; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx."tourYears" (id, "tourId", year, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
79c5a314-b6d5-4ec7-b750-5536a9c7f0bc	2968e1dd-c4fd-4b16-9054-2435d183d391	2021	t	f	2022-08-02 09:41:31.130417+00	2022-08-02 09:41:31.130417+00
5afc4f51-801b-4dd9-bca4-2af95c743389	2968e1dd-c4fd-4b16-9054-2435d183d391	2022	t	f	2022-08-02 09:41:31.130417+00	2022-08-02 09:41:31.130417+00
\.


--
-- TOC entry 3197 (class 0 OID 19518)
-- Dependencies: 283
-- Data for Name: tours; Type: TABLE DATA; Schema: nrx; Owner: -
--

COPY nrx.tours (id, name, gender, "isActive", "isArchived", "createdAt", "updatedAt") FROM stdin;
2968e1dd-c4fd-4b16-9054-2435d183d391	Supercar	men	t	f	2022-08-02 09:41:31.130417+00	2022-08-02 09:41:31.130417+00
\.


--
-- TOC entry 3008 (class 2606 OID 19684)
-- Name: projectionEventOutcome PK_0ebdb7d0fbf8b65b7e3c869914b; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventOutcome"
    ADD CONSTRAINT "PK_0ebdb7d0fbf8b65b7e3c869914b" PRIMARY KEY (id);


--
-- TOC entry 2997 (class 2606 OID 19603)
-- Name: eventRounds PK_1c46d4b53e61e4d6fc23e0818ae; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventRounds"
    ADD CONSTRAINT "PK_1c46d4b53e61e4d6fc23e0818ae" PRIMARY KEY (id);


--
-- TOC entry 2993 (class 2606 OID 19581)
-- Name: eventParticipants PK_215321709946d3ffe0903017745; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventParticipants"
    ADD CONSTRAINT "PK_215321709946d3ffe0903017745" PRIMARY KEY (id);


--
-- TOC entry 2984 (class 2606 OID 19529)
-- Name: tours PK_2202ba445792c1ad0edf2de8de2; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.tours
    ADD CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY (id);


--
-- TOC entry 2980 (class 2606 OID 19505)
-- Name: athletes PK_3b92d2bd187b2b2d27d4c47f1c4; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.athletes
    ADD CONSTRAINT "PK_3b92d2bd187b2b2d27d4c47f1c4" PRIMARY KEY (id);


--
-- TOC entry 2989 (class 2606 OID 19563)
-- Name: events PK_40731c7151fe4be3116e45ddf73; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.events
    ADD CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY (id);


--
-- TOC entry 3016 (class 2606 OID 19753)
-- Name: eventOddDerivatives PK_5ed76aede1dfd70365753d3f815; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventOddDerivatives"
    ADD CONSTRAINT "PK_5ed76aede1dfd70365753d3f815" PRIMARY KEY (id);


--
-- TOC entry 3012 (class 2606 OID 19711)
-- Name: projectionEventHeatOutcome PK_635aa17c51cae6c575825f22a83; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventHeatOutcome"
    ADD CONSTRAINT "PK_635aa17c51cae6c575825f22a83" PRIMARY KEY (id);


--
-- TOC entry 3014 (class 2606 OID 19741)
-- Name: oddDerivatives PK_6d5cd6738b99ddf81f7302b18e3; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."oddDerivatives"
    ADD CONSTRAINT "PK_6d5cd6738b99ddf81f7302b18e3" PRIMARY KEY (id);


--
-- TOC entry 3021 (class 2606 OID 28440)
-- Name: playerHeadToHeads PK_84c8d4a752a2834aabe5874c01f; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."playerHeadToHeads"
    ADD CONSTRAINT "PK_84c8d4a752a2834aabe5874c01f" PRIMARY KEY (id);


--
-- TOC entry 3018 (class 2606 OID 19778)
-- Name: propBets PK_870ee4467e4e760199cbfd8832f; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."propBets"
    ADD CONSTRAINT "PK_870ee4467e4e760199cbfd8832f" PRIMARY KEY (id);


--
-- TOC entry 2982 (class 2606 OID 19517)
-- Name: rounds PK_9d254884a20817016e2f877c7e7; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.rounds
    ADD CONSTRAINT "PK_9d254884a20817016e2f877c7e7" PRIMARY KEY (id);


--
-- TOC entry 3001 (class 2606 OID 19628)
-- Name: roundHeats PK_ba262fd62e6024c454976b9ce77; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."roundHeats"
    ADD CONSTRAINT "PK_ba262fd62e6024c454976b9ce77" PRIMARY KEY (id);


--
-- TOC entry 3005 (class 2606 OID 19652)
-- Name: scores PK_c36917e6f26293b91d04b8fd521; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.scores
    ADD CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY (id);


--
-- TOC entry 2987 (class 2606 OID 19544)
-- Name: tourYears PK_f706c877e5f3987d7c3889d87ce; Type: CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."tourYears"
    ADD CONSTRAINT "PK_f706c877e5f3987d7c3889d87ce" PRIMARY KEY (id);


--
-- TOC entry 2994 (class 1259 OID 19609)
-- Name: IDX_01850957a3f8d4d12a88cfd968; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_01850957a3f8d4d12a88cfd968" ON nrx."eventRounds" USING btree ("eventId");


--
-- TOC entry 2990 (class 1259 OID 19587)
-- Name: IDX_05379a5f47c140d1c438d688cd; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_05379a5f47c140d1c438d688cd" ON nrx."eventParticipants" USING btree ("eventId");


--
-- TOC entry 2998 (class 1259 OID 19640)
-- Name: IDX_088b142b376c47eb4028d97ed4; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_088b142b376c47eb4028d97ed4" ON nrx."roundHeats" USING btree ("roundId");


--
-- TOC entry 3002 (class 1259 OID 19658)
-- Name: IDX_1094d63480ec9621dc91dec2df; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_1094d63480ec9621dc91dec2df" ON nrx.scores USING btree ("eventId");


--
-- TOC entry 2995 (class 1259 OID 19615)
-- Name: IDX_33b82492b5287d7716b560ac82; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_33b82492b5287d7716b560ac82" ON nrx."eventRounds" USING btree ("roundId");


--
-- TOC entry 2991 (class 1259 OID 19593)
-- Name: IDX_463e11f8be37c11f0b116c3112; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_463e11f8be37c11f0b116c3112" ON nrx."eventParticipants" USING btree ("athleteId");


--
-- TOC entry 3003 (class 1259 OID 19664)
-- Name: IDX_598e641600f28982d16a7ea911; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_598e641600f28982d16a7ea911" ON nrx.scores USING btree ("roundHeatId");


--
-- TOC entry 2999 (class 1259 OID 19634)
-- Name: IDX_6116a364beaa2bc7ea5053f16e; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_6116a364beaa2bc7ea5053f16e" ON nrx."roundHeats" USING btree ("eventId");


--
-- TOC entry 2985 (class 1259 OID 19550)
-- Name: IDX_6604ee43714d4e6b9a791e3ccf; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_6604ee43714d4e6b9a791e3ccf" ON nrx."tourYears" USING btree ("tourId");


--
-- TOC entry 3006 (class 1259 OID 19690)
-- Name: IDX_6793bbc8e9931aa258e4081154; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_6793bbc8e9931aa258e4081154" ON nrx."projectionEventOutcome" USING btree ("eventId");


--
-- TOC entry 3019 (class 1259 OID 28446)
-- Name: IDX_9322065562bc0412e1b3bf5fb9; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_9322065562bc0412e1b3bf5fb9" ON nrx."playerHeadToHeads" USING btree ("eventId");


--
-- TOC entry 3009 (class 1259 OID 19717)
-- Name: IDX_c3ee084ef88b6f182ff3ba9ce5; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_c3ee084ef88b6f182ff3ba9ce5" ON nrx."projectionEventHeatOutcome" USING btree ("eventId");


--
-- TOC entry 3010 (class 1259 OID 19729)
-- Name: IDX_eb8f11a0fd6a7ba86bdf22f81a; Type: INDEX; Schema: nrx; Owner: -
--

CREATE INDEX "IDX_eb8f11a0fd6a7ba86bdf22f81a" ON nrx."projectionEventHeatOutcome" USING btree ("roundHeatId");


--
-- TOC entry 3026 (class 2606 OID 19604)
-- Name: eventRounds FK_01850957a3f8d4d12a88cfd9688; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventRounds"
    ADD CONSTRAINT "FK_01850957a3f8d4d12a88cfd9688" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3024 (class 2606 OID 19582)
-- Name: eventParticipants FK_05379a5f47c140d1c438d688cd1; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventParticipants"
    ADD CONSTRAINT "FK_05379a5f47c140d1c438d688cd1" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3023 (class 2606 OID 19564)
-- Name: events FK_05e57702a465f02b5ef955f9e2b; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.events
    ADD CONSTRAINT "FK_05e57702a465f02b5ef955f9e2b" FOREIGN KEY ("tourYearId") REFERENCES nrx."tourYears"(id);


--
-- TOC entry 3040 (class 2606 OID 19779)
-- Name: propBets FK_0733412ac8a24b6aecb70a0d2cd; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."propBets"
    ADD CONSTRAINT "FK_0733412ac8a24b6aecb70a0d2cd" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3028 (class 2606 OID 19635)
-- Name: roundHeats FK_088b142b376c47eb4028d97ed49; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."roundHeats"
    ADD CONSTRAINT "FK_088b142b376c47eb4028d97ed49" FOREIGN KEY ("roundId") REFERENCES nrx.rounds(id);


--
-- TOC entry 3030 (class 2606 OID 19653)
-- Name: scores FK_1094d63480ec9621dc91dec2df4; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.scores
    ADD CONSTRAINT "FK_1094d63480ec9621dc91dec2df4" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3027 (class 2606 OID 19610)
-- Name: eventRounds FK_33b82492b5287d7716b560ac82b; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventRounds"
    ADD CONSTRAINT "FK_33b82492b5287d7716b560ac82b" FOREIGN KEY ("roundId") REFERENCES nrx.rounds(id);


--
-- TOC entry 3025 (class 2606 OID 19588)
-- Name: eventParticipants FK_463e11f8be37c11f0b116c31129; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventParticipants"
    ADD CONSTRAINT "FK_463e11f8be37c11f0b116c31129" FOREIGN KEY ("athleteId") REFERENCES nrx.athletes(id);


--
-- TOC entry 3031 (class 2606 OID 19659)
-- Name: scores FK_598e641600f28982d16a7ea9115; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.scores
    ADD CONSTRAINT "FK_598e641600f28982d16a7ea9115" FOREIGN KEY ("roundHeatId") REFERENCES nrx."roundHeats"(id);


--
-- TOC entry 3035 (class 2606 OID 19718)
-- Name: projectionEventHeatOutcome FK_60b7c68f3f7784c2d4c7326674d; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventHeatOutcome"
    ADD CONSTRAINT "FK_60b7c68f3f7784c2d4c7326674d" FOREIGN KEY ("eventParticipantId") REFERENCES nrx."eventParticipants"(id);


--
-- TOC entry 3029 (class 2606 OID 19629)
-- Name: roundHeats FK_6116a364beaa2bc7ea5053f16e8; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."roundHeats"
    ADD CONSTRAINT "FK_6116a364beaa2bc7ea5053f16e8" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3022 (class 2606 OID 19545)
-- Name: tourYears FK_6604ee43714d4e6b9a791e3ccfc; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."tourYears"
    ADD CONSTRAINT "FK_6604ee43714d4e6b9a791e3ccfc" FOREIGN KEY ("tourId") REFERENCES nrx.tours(id);


--
-- TOC entry 3033 (class 2606 OID 19685)
-- Name: projectionEventOutcome FK_6793bbc8e9931aa258e40811543; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventOutcome"
    ADD CONSTRAINT "FK_6793bbc8e9931aa258e40811543" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3038 (class 2606 OID 19754)
-- Name: eventOddDerivatives FK_7e3bc955b719c9f36f90097c3b8; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventOddDerivatives"
    ADD CONSTRAINT "FK_7e3bc955b719c9f36f90097c3b8" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3042 (class 2606 OID 28452)
-- Name: playerHeadToHeads FK_81494dbc95cb3195b8fb8e75369; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."playerHeadToHeads"
    ADD CONSTRAINT "FK_81494dbc95cb3195b8fb8e75369" FOREIGN KEY ("eventParticipant2Id") REFERENCES nrx."eventParticipants"(id);


--
-- TOC entry 3034 (class 2606 OID 19691)
-- Name: projectionEventOutcome FK_81d623cb9a5d202896ce81bc557; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventOutcome"
    ADD CONSTRAINT "FK_81d623cb9a5d202896ce81bc557" FOREIGN KEY ("eventParticipantId") REFERENCES nrx."eventParticipants"(id);


--
-- TOC entry 3043 (class 2606 OID 28441)
-- Name: playerHeadToHeads FK_9322065562bc0412e1b3bf5fb98; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."playerHeadToHeads"
    ADD CONSTRAINT "FK_9322065562bc0412e1b3bf5fb98" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3044 (class 2606 OID 28457)
-- Name: playerHeadToHeads FK_93b00f67ff6e0361450cf4dfb44; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."playerHeadToHeads"
    ADD CONSTRAINT "FK_93b00f67ff6e0361450cf4dfb44" FOREIGN KEY ("eventParticipantWinnerId") REFERENCES nrx."eventParticipants"(id);


--
-- TOC entry 3041 (class 2606 OID 19784)
-- Name: propBets FK_b720a11527b0ebeda50c5c75362; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."propBets"
    ADD CONSTRAINT "FK_b720a11527b0ebeda50c5c75362" FOREIGN KEY ("eventParticipantId") REFERENCES nrx."eventParticipants"(id);


--
-- TOC entry 3036 (class 2606 OID 19712)
-- Name: projectionEventHeatOutcome FK_c3ee084ef88b6f182ff3ba9ce5a; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventHeatOutcome"
    ADD CONSTRAINT "FK_c3ee084ef88b6f182ff3ba9ce5a" FOREIGN KEY ("eventId") REFERENCES nrx.events(id);


--
-- TOC entry 3032 (class 2606 OID 19665)
-- Name: scores FK_ea600ad12d60c6b5015f45a8abd; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx.scores
    ADD CONSTRAINT "FK_ea600ad12d60c6b5015f45a8abd" FOREIGN KEY ("athleteId") REFERENCES nrx.athletes(id);


--
-- TOC entry 3039 (class 2606 OID 19759)
-- Name: eventOddDerivatives FK_ea866eabba264634f90b605c42b; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."eventOddDerivatives"
    ADD CONSTRAINT "FK_ea866eabba264634f90b605c42b" FOREIGN KEY ("oddDerivativeId") REFERENCES nrx."oddDerivatives"(id);


--
-- TOC entry 3037 (class 2606 OID 19724)
-- Name: projectionEventHeatOutcome FK_eb8f11a0fd6a7ba86bdf22f81ae; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."projectionEventHeatOutcome"
    ADD CONSTRAINT "FK_eb8f11a0fd6a7ba86bdf22f81ae" FOREIGN KEY ("roundHeatId") REFERENCES nrx."roundHeats"(id);


--
-- TOC entry 3045 (class 2606 OID 28447)
-- Name: playerHeadToHeads FK_ed26f86e3d9c09d41838ae66d7f; Type: FK CONSTRAINT; Schema: nrx; Owner: -
--

ALTER TABLE ONLY nrx."playerHeadToHeads"
    ADD CONSTRAINT "FK_ed26f86e3d9c09d41838ae66d7f" FOREIGN KEY ("eventParticipant1Id") REFERENCES nrx."eventParticipants"(id);


-- Completed on 2022-09-09 00:11:01 IST

--
-- PostgreSQL database dump complete
--

