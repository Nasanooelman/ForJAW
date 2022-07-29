// Fill out your copyright notice in the Description page of Project Settings.


#include "CPizza.h"

CPizza::CPizza()
{
	Base = "None";
	Cooked = "Uncooked";
	BIsBoxed = false;
}

CPizza::~CPizza()
{
	UE_LOG(LogClass, Log, TEXT("CALLING DECONSTRUCTOR"));
}


void CPizza::SetBase(FString PizzaBase)
{
	if (Base == "None")
	{
		Base = PizzaBase;
	}
}

bool CPizza::AddTopping(FString Topping)
{
	bool bAddedTopping = true;
	if (Toppings.size() < (MAX_TOPPINGS-1))
	{
		Toppings.push_back(Topping);
	}
	else
	{
		bAddedTopping = false;
	}

	return bAddedTopping;
}
