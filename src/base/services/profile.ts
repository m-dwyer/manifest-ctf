import { prisma } from "@/common/providers/prismaClient";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  getDay,
  getMonth,
  getQuarter,
  getYear,
  startOfDay,
  sub,
} from "date-fns";
import { ProfileOverview } from "@/base/schemas/profileOverview";

type Period = "1W" | "1M" | "3M" | "1Y";

const eachPeriodOfInterval = ({ period }: { period: Period }) => {
  const today = new Date();

  switch (period) {
    case "1W":
      return eachDayOfInterval({
        start: sub(today, { days: 6 }),
        end: today,
      });
    case "1M":
      return eachWeekOfInterval(
        {
          start: sub(today, { months: 1 }),
          end: today,
        },
        { weekStartsOn: 0 }
      );
    case "3M":
      return eachMonthOfInterval({
        start: sub(today, { months: 3 - 1 }),
        end: today,
      });
    case "1Y":
      return eachMonthOfInterval({
        start: sub(today, { months: 12 - 1 }),
        end: today,
      });
  }

  return [];
};

const getDateRangeForPeriod = ({ period }: { period: Period }) => {
  const today = new Date();
  let earliest = today;

  switch (period) {
    case "1W":
      earliest = sub(today, { days: 7 - 1 });
      break;
    case "1M":
      earliest = sub(today, { weeks: 4 - 1 });
      break;
    case "3M":
      earliest = sub(today, { months: 3 - 1 });
      break;
    case "1Y":
      earliest = sub(today, { months: 12 - 1 });
      break;
  }

  return [startOfDay(earliest), today];
};

export const fetchProfile = async (
  userId: string,
  period: Period
): Promise<ServiceResponse<ProfileOverview>> => {
  const dateBuckets = eachPeriodOfInterval({
    period,
  });

  const [earliest, latest] = getDateRangeForPeriod({ period });

  const result = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      challengeAttempts: {
        where: {
          completed: {
            gte: earliest,
          },
        },
        select: {
          completed: true,
          points_scored: true,
        },
        orderBy: {
          completed: "asc",
        },
      },
    },
  });

  const bucketedResults = result?.challengeAttempts.reduce((accum, current) => {
    const key = getBucketForPeriod({
      date: current.completed!,
      period: period,
    });
    accum[key!] = accum[key!] || [];
    accum[key!].push(current);
    return accum;
  }, {} as Record<string, [{ completed: Date | null; points_scored: number }]>);

  if (result?.id === undefined || bucketedResults === undefined) {
    return { error: "Invalid profile", data: null };
  }

  return {
    data: { id: result?.id, attemptsByPeriod: bucketedResults },
    error: null,
  };
};

const getBucketForPeriod = ({
  date,
  period,
}: {
  date: Date;
  period: Period;
}) => {
  switch (period) {
    case "1W":
      return getDay(date);
    case "1M":
      return getMonth(date);
    case "3M":
      return getQuarter(date);
    case "1Y":
      return getYear(date);
  }
};
